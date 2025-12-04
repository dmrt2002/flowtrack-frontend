/**
 * Pitch Configuration API Client
 *
 * Frontend API client for pitch configuration endpoints
 */

import request from '@/lib/request';
import type {
  PitchConfiguration,
  PitchTemplate,
  PitchQuickSettings,
  PitchAdvancedConfig,
} from '../types/pitch-config';

const BASE_PATH = '/api/v1/pitch-config';

export const pitchConfigApi = {
  /**
   * Get workspace pitch configuration
   */
  async getConfig(): Promise<PitchConfiguration> {
    const response = await request.get<PitchConfiguration>(BASE_PATH);
    return response.data;
  },

  /**
   * Get all templates (built-in + custom)
   */
  async getAllTemplates(): Promise<PitchTemplate[]> {
    const response = await request.get<PitchTemplate[]>(
      `${BASE_PATH}/templates`
    );
    return response.data;
  },

  /**
   * Update quick settings
   */
  async updateQuickSettings(
    quickSettings: Partial<PitchQuickSettings>
  ): Promise<PitchConfiguration> {
    const response = await request.patch<PitchConfiguration>(
      `${BASE_PATH}/quick-settings`,
      quickSettings
    );
    return response.data;
  },

  /**
   * Select active template
   */
  async selectTemplate(templateId: string): Promise<PitchConfiguration> {
    const response = await request.post<PitchConfiguration>(
      `${BASE_PATH}/select-template`,
      {
        templateId,
      }
    );
    return response.data;
  },

  /**
   * Create custom template
   */
  async createTemplate(
    template: Omit<PitchTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PitchConfiguration> {
    const response = await request.post<PitchConfiguration>(
      `${BASE_PATH}/templates`,
      template
    );
    return response.data;
  },

  /**
   * Update custom template
   */
  async updateTemplate(
    templateId: string,
    updates: Partial<PitchTemplate>
  ): Promise<PitchConfiguration> {
    const response = await request.patch<PitchConfiguration>(
      `${BASE_PATH}/templates/${templateId}`,
      updates
    );
    return response.data;
  },

  /**
   * Delete custom template
   */
  async deleteTemplate(templateId: string): Promise<PitchConfiguration> {
    const response = await request.delete<PitchConfiguration>(
      `${BASE_PATH}/templates/${templateId}`
    );
    return response.data;
  },

  /**
   * Update advanced config
   */
  async updateAdvancedConfig(
    advancedConfig: Partial<PitchAdvancedConfig>
  ): Promise<PitchConfiguration> {
    const response = await request.patch<PitchConfiguration>(
      `${BASE_PATH}/advanced`,
      advancedConfig
    );
    return response.data;
  },

  /**
   * Validate template syntax
   */
  async validateTemplate(
    template: string
  ): Promise<{ valid: boolean; error?: string }> {
    const response = await request.post<{ valid: boolean; error?: string }>(
      `${BASE_PATH}/validate-template`,
      { template }
    );
    return response.data;
  },

  /**
   * Reset to default configuration
   */
  async resetToDefault(): Promise<PitchConfiguration> {
    const response = await request.post<PitchConfiguration>(
      `${BASE_PATH}/reset`,
      {}
    );
    return response.data;
  },
};
