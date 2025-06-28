import React, { useState } from 'react';
import { ArrowLeft, Volume2, Monitor, Gamepad2, Wifi, Accessibility } from 'lucide-react';
import type { Screen } from '../App';

interface SettingsProps {
  onNavigate: (screen: Screen) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const [selectedTab, setSelectedTab] = useState<'audio' | 'video' | 'controls' | 'network' | 'accessibility'>('audio');

  const [settings, setSettings] = useState({
    audio: {
      masterVolume: 75,
      fxVolume: 80,
      musicVolume: 65,
      voiceVolume: 90,
      muteAll: false
    },
    video: {
      resolution: '1920x1080',
      quality: 'high',
      shadows: true,
      particles: true,
      vsync: true,
      framerate: 60
    },
    controls: {
      mouseSensitivity: 50,
      invertY: false,
      autoRun: false,
      showCrosshair: true
    },
    network: {
      region: 'auto',
      showPing: true,
      autoConnect: true
    },
    accessibility: {
      colorblindMode: 'none',
      fontSize: 'medium',
      uiScale: 100,
      highContrast: false,
      reducedMotion: false
    }
  });

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'audio', label: 'Audio', icon: <Volume2 className="w-5 h-5" /> },
    { id: 'video', label: 'Video', icon: <Monitor className="w-5 h-5" /> },
    { id: 'controls', label: 'Controls', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'network', label: 'Network', icon: <Wifi className="w-5 h-5" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Accessibility className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => onNavigate('menu')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu
        </button>

        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <div className="w-24" /> {/* Spacer */}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              {/* Audio Settings */}
              {selectedTab === 'audio' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Audio Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-white font-medium">Mute All Audio</label>
                      <button
                        onClick={() => updateSetting('audio', 'muteAll', !settings.audio.muteAll)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          settings.audio.muteAll ? 'bg-purple-600' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.audio.muteAll ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    {!settings.audio.muteAll && (
                      <>
                        <SliderSetting
                          label="Master Volume"
                          value={settings.audio.masterVolume}
                          onChange={(value) => updateSetting('audio', 'masterVolume', value)}
                        />
                        <SliderSetting
                          label="Sound Effects"
                          value={settings.audio.fxVolume}
                          onChange={(value) => updateSetting('audio', 'fxVolume', value)}
                        />
                        <SliderSetting
                          label="Music"
                          value={settings.audio.musicVolume}
                          onChange={(value) => updateSetting('audio', 'musicVolume', value)}
                        />
                        <SliderSetting
                          label="Voice Chat"
                          value={settings.audio.voiceVolume}
                          onChange={(value) => updateSetting('audio', 'voiceVolume', value)}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Video Settings */}
              {selectedTab === 'video' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Video Settings</h2>
                  
                  <div className="space-y-4">
                    <SelectSetting
                      label="Resolution"
                      value={settings.video.resolution}
                      options={['1280x720', '1920x1080', '2560x1440', '3840x2160']}
                      onChange={(value) => updateSetting('video', 'resolution', value)}
                    />
                    <SelectSetting
                      label="Quality Preset"
                      value={settings.video.quality}
                      options={['low', 'medium', 'high', 'ultra']}
                      onChange={(value) => updateSetting('video', 'quality', value)}
                    />
                    <SliderSetting
                      label="Frame Rate Limit"
                      value={settings.video.framerate}
                      onChange={(value) => updateSetting('video', 'framerate', value)}
                      min={30}
                      max={144}
                    />
                    
                    <ToggleSetting
                      label="Shadows"
                      value={settings.video.shadows}
                      onChange={(value) => updateSetting('video', 'shadows', value)}
                    />
                    <ToggleSetting
                      label="Particle Effects"
                      value={settings.video.particles}
                      onChange={(value) => updateSetting('video', 'particles', value)}
                    />
                    <ToggleSetting
                      label="V-Sync"
                      value={settings.video.vsync}
                      onChange={(value) => updateSetting('video', 'vsync', value)}
                    />
                  </div>
                </div>
              )}

              {/* Controls Settings */}
              {selectedTab === 'controls' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Control Settings</h2>
                  
                  <div className="space-y-4">
                    <SliderSetting
                      label="Mouse Sensitivity"
                      value={settings.controls.mouseSensitivity}
                      onChange={(value) => updateSetting('controls', 'mouseSensitivity', value)}
                    />
                    
                    <ToggleSetting
                      label="Invert Y-Axis"
                      value={settings.controls.invertY}
                      onChange={(value) => updateSetting('controls', 'invertY', value)}
                    />
                    <ToggleSetting
                      label="Auto Run"
                      value={settings.controls.autoRun}
                      onChange={(value) => updateSetting('controls', 'autoRun', value)}
                    />
                    <ToggleSetting
                      label="Show Crosshair"
                      value={settings.controls.showCrosshair}
                      onChange={(value) => updateSetting('controls', 'showCrosshair', value)}
                    />

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Key Bindings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <KeyBindSetting label="Move Forward" binding="W" />
                        <KeyBindSetting label="Move Backward" binding="S" />
                        <KeyBindSetting label="Move Left" binding="A" />
                        <KeyBindSetting label="Move Right" binding="D" />
                        <KeyBindSetting label="Inventory" binding="I" />
                        <KeyBindSetting label="Weapon Wheel" binding="E" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Network Settings */}
              {selectedTab === 'network' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Network Settings</h2>
                  
                  <div className="space-y-4">
                    <SelectSetting
                      label="Preferred Region"
                      value={settings.network.region}
                      options={['auto', 'us-east', 'us-west', 'eu-west', 'asia-pacific']}
                      onChange={(value) => updateSetting('network', 'region', value)}
                    />
                    
                    <ToggleSetting
                      label="Show Ping Overlay"
                      value={settings.network.showPing}
                      onChange={(value) => updateSetting('network', 'showPing', value)}
                    />
                    <ToggleSetting
                      label="Auto Connect to Friends"
                      value={settings.network.autoConnect}
                      onChange={(value) => updateSetting('network', 'autoConnect', value)}
                    />
                  </div>
                </div>
              )}

              {/* Accessibility Settings */}
              {selectedTab === 'accessibility' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Accessibility Settings</h2>
                  
                  <div className="space-y-4">
                    <SelectSetting
                      label="Colorblind Support"
                      value={settings.accessibility.colorblindMode}
                      options={['none', 'protanopia', 'deuteranopia', 'tritanopia']}
                      onChange={(value) => updateSetting('accessibility', 'colorblindMode', value)}
                    />
                    <SelectSetting
                      label="Font Size"
                      value={settings.accessibility.fontSize}
                      options={['small', 'medium', 'large', 'extra-large']}
                      onChange={(value) => updateSetting('accessibility', 'fontSize', value)}
                    />
                    <SliderSetting
                      label="UI Scale"
                      value={settings.accessibility.uiScale}
                      onChange={(value) => updateSetting('accessibility', 'uiScale', value)}
                      min={75}
                      max={150}
                    />
                    
                    <ToggleSetting
                      label="High Contrast Mode"
                      value={settings.accessibility.highContrast}
                      onChange={(value) => updateSetting('accessibility', 'highContrast', value)}
                    />
                    <ToggleSetting
                      label="Reduced Motion"
                      value={settings.accessibility.reducedMotion}
                      onChange={(value) => updateSetting('accessibility', 'reducedMotion', value)}
                    />
                  </div>
                </div>
              )}

              {/* Save/Reset Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-slate-700">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300">
                  Save Settings
                </button>
                <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SliderSetting({ label, value, onChange, min = 0, max = 100 }: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label className="text-white font-medium">{label}</label>
        <span className="text-slate-300">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
}

function SelectSetting({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-white font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleSetting({ label, value, onChange }: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-white font-medium">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-colors ${
          value ? 'bg-purple-600' : 'bg-slate-600'
        }`}
      >
        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
          value ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </button>
    </div>
  );
}

function KeyBindSetting({ label, binding }: { label: string; binding: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
      <span className="text-white font-medium">{label}</span>
      <button className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded border border-slate-500 transition-colors">
        {binding}
      </button>
    </div>
  );
}