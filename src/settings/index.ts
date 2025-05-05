import { App, PluginSettingTab, Setting } from 'obsidian';
import GyazoPlugin from '../../main';
import { translations } from '../i18n/index';

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

        new Setting(containerEl)
            .setName(t.accessTokenLabel)
            .setDesc(t.accessTokenDesc)
            .addText(text => text
                .setPlaceholder('Enter your Gyazo access token')
                .setValue(this.plugin.settings.accessToken)
                .onChange(async (value) => {
                    this.plugin.settings.accessToken = value;
                    await this.plugin.saveSettings();
                }));

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
