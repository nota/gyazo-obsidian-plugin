import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import GyazoPlugin from '../../main';
import { translations } from '../i18n/index';
import { GyazoApi } from '../api/index';

export class GyazoSettingTab extends PluginSettingTab {
    plugin: GyazoPlugin;

    constructor(app: App, plugin: GyazoPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        const t = this.plugin.getTranslation();

        containerEl.empty();
        containerEl.createEl('h2', { text: t.settingsTitle });

        const tokenSetting = new Setting(containerEl)
            .setName(t.accessTokenLabel)
            .setDesc(t.accessTokenDesc);
            
        if (this.plugin.settings.accessToken) {
            const maskedToken = this.plugin.settings.accessToken.substring(0, 4) + 
                               '...' + 
                               this.plugin.settings.accessToken.substring(
                                   this.plugin.settings.accessToken.length - 4
                               );
                               
            tokenSetting.addText(text => text
                .setValue(maskedToken)
                .setDisabled(true)
            );
            
            tokenSetting.addButton(button => button
                .setButtonText(t.revokeToken)
                .setTooltip(t.revokeTokenDesc)
                .onClick(async () => {
                    this.plugin.settings.accessToken = '';
                    this.plugin.api = new GyazoApi('');
                    await this.plugin.saveSettings();
                    new Notice(t.tokenRevoked);
                    this.display(); // Refresh the settings view
                })
            );
        } else {
            tokenSetting.addText(text => text
                .setPlaceholder('Enter your Gyazo access token')
                .setValue('')
                .onChange(async (value) => {
                    this.plugin.settings.accessToken = value;
                    await this.plugin.saveSettings();
                }));
                
            tokenSetting.addButton(button => button
                .setButtonText(t.openApiDashboard)
                .setTooltip(t.openApiDashboardDesc)
                .onClick(() => {
                    window.open('https://gyazo.com/oauth/applications', '_blank');
                })
            );
        }

        new Setting(containerEl)
            .setName(t.languageLabel)
            .setDesc(t.languageDesc)
            .addDropdown(dropdown => dropdown
                .addOption('en', 'English')
                .addOption('ja', '日本語')
                .setValue(this.plugin.settings.language)
                .onChange(async (value: 'en' | 'ja') => {
                    this.plugin.settings.language = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to update language
                }));

        new Setting(containerEl)
            .setName(t.isPro)
            .setDesc(t.isProDesc)
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.isPro)
                .onChange(async (value) => {
                    this.plugin.settings.isPro = value;
                    await this.plugin.saveSettings();
                }));
    }
}
