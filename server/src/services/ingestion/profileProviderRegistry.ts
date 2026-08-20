import { ProfileExtractionProvider, ExtractionResult, ExtractionDiagnostics } from './types.js';
import { DirectLinkedInProvider } from './directLinkedInProvider.service.js';
import { ExternalProfileProvider } from './externalProfileProvider.service.js';
import { PDLProfileProvider } from './pdlProfileProvider.service.js';

/**
 * ProfileProviderRegistry
 *
 * Central registry and factory for ProfileIQ profile extraction providers.
 * Decouples controller & ingestion services from specific provider implementations.
 *
 * Configuration:
 * - PROFILE_EXTRACTION_PROVIDER: Primary provider ID ('pdl', 'direct-linkedin', or 'external-provider').
 * - PROFILE_PROVIDER_CHAIN: Optional comma-separated fallback chain (e.g., 'pdl,direct-linkedin').
 */
export class ProfileProviderRegistry {
  private providers: Map<string, ProfileExtractionProvider> = new Map();

  constructor() {
    // Register default built-in providers
    this.registerProvider(new DirectLinkedInProvider());
    this.registerProvider(new ExternalProfileProvider());
    this.registerProvider(new PDLProfileProvider());
  }

  /**
   * Register a new profile extraction provider
   */
  registerProvider(provider: ProfileExtractionProvider): void {
    console.log(`[Provider Registry] Registered provider: "${provider.id}" (${provider.name})`);
    this.providers.set(provider.id, provider);
  }

  /**
   * Get provider instance by ID
   */
  getProvider(id: string): ProfileExtractionProvider | undefined {
    return this.providers.get(id);
  }

  /**
   * Return list of all registered providers
   */
  getAllProviders(): ProfileExtractionProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Return status of all registered providers
   */
  async getProvidersStatus(): Promise<{ id: string; name: string; available: boolean }[]> {
    const statuses = await Promise.all(
      this.getAllProviders().map(async (provider) => ({
        id: provider.id,
        name: provider.name,
        available: await provider.isAvailable(),
      }))
    );
    return statuses;
  }

  /**
   * Resolve active extraction provider based on environment configuration
   */
  async getActiveProvider(): Promise<ProfileExtractionProvider> {
    const configuredId = (process.env.PROFILE_EXTRACTION_PROVIDER || 'pdl').trim();

    const primaryProvider = this.providers.get(configuredId);
    if (primaryProvider) {
      return primaryProvider;
    }

    // Fallback search through chain if configured
    const chainStr = process.env.PROFILE_PROVIDER_CHAIN;
    if (chainStr) {
      const chain = chainStr.split(',').map((s) => s.trim());
      for (const providerId of chain) {
        const p = this.providers.get(providerId);
        if (p) {
          console.log(`[Provider Registry] Using fallback provider from chain: "${p.id}"`);
          return p;
        }
      }
    }

    // Fallback no-op provider if configured provider is not found
    return new UnavailableFallbackProvider(configuredId);
  }

  /**
   * Execute extraction across configured provider or provider chain
   */
  async executeExtraction(profileUrl: string): Promise<ExtractionResult> {
    const chainStr = process.env.PROFILE_PROVIDER_CHAIN;

    if (chainStr) {
      const chain = chainStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      let lastResult: ExtractionResult | null = null;
      let fallbackAttempted = false;

      for (let i = 0; i < chain.length; i++) {
        const providerId = chain[i];
        const provider = this.providers.get(providerId);

        if (!provider) continue;

        const available = await provider.isAvailable();
        if (!available) continue;

        console.log(`[Provider Execution Chain] Attempting provider [${i + 1}/${chain.length}]: "${provider.id}"`);
        const result = await provider.extractProfile(profileUrl);

        if (result.diagnostics) {
          result.diagnostics.fallbackAttempted = fallbackAttempted;
        }

        if (result.success) {
          return result;
        }

        lastResult = result;
        fallbackAttempted = true;
      }

      if (lastResult) {
        return lastResult;
      }
    }

    // Default single provider execution
    const activeProvider = await this.getActiveProvider();
    return activeProvider.extractProfile(profileUrl);
  }
}

/**
 * Fallback provider returned when no configured provider is available
 */
class UnavailableFallbackProvider implements ProfileExtractionProvider {
  id = 'unavailable';
  name = 'No Profile Provider Available';

  constructor(private configuredName: string) {}

  async isAvailable(): Promise<boolean> {
    return false;
  }

  async extractProfile(): Promise<ExtractionResult> {
    const diagnostics: ExtractionDiagnostics = {
      provider: this.id,
      providerAvailable: false,
      configuredProvider: this.configuredName,
      pageType: 'unknown',
      recordsFound: false,
      profileSignalsDetected: {
        name: false,
        headline: false,
        about: false,
        skillsCount: 0,
        experienceCount: 0,
        educationCount: 0,
      },
    };

    return {
      success: false,
      provider: this.id,
      error: {
        code: 'PROVIDER_UNAVAILABLE',
        message: `Configured provider "${this.configuredName}" is unavailable or not properly configured.`,
      },
      diagnostics,
    };
  }
}

// Global Singleton Instance
export const profileProviderRegistry = new ProfileProviderRegistry();

/**
 * Helper Factory function to return configured provider instance
 */
export function createProfileExtractionProvider(): Promise<ProfileExtractionProvider> {
  return profileProviderRegistry.getActiveProvider();
}
