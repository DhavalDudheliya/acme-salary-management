import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@supporthub/ui/components/card";
import { Separator } from "@supporthub/ui/components/separator";

import type { WorkspaceTheme } from "@/lib/services/workspace.service";
import { ColorPicker } from "@/components/settings/branding/color-picker";
import { FontSelector } from "@/components/settings/branding/font-selector";
import { RadiusSlider } from "@/components/settings/branding/radius-slider";
import { ModeSelector } from "@/components/settings/branding/mode-selector";
import { AssetUpload } from "@/components/settings/branding/asset-upload";

interface BrandingSettingsEditorProps {
  draft: WorkspaceTheme;
  updateDraft: (updates: Partial<WorkspaceTheme>) => void;
  handleLogoUpload: (file: File) => Promise<void>;
  handleLogoRemove: () => Promise<void>;
  handleFaviconUpload: (file: File) => Promise<void>;
  handleFaviconRemove: () => Promise<void>;
}

export function BrandingSettingsEditor({
  draft,
  updateDraft,
  handleLogoUpload,
  handleLogoRemove,
  handleFaviconUpload,
  handleFaviconRemove,
}: BrandingSettingsEditorProps) {
  return (
    <div className="lg:col-span-3 space-y-6">
      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Colors</CardTitle>
          <CardDescription>
            Set your brand colors. All UI elements will adapt automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ColorPicker
            label="Primary Color"
            value={draft.primaryColor}
            onChange={(c) => updateDraft({ primaryColor: c })}
            description="Main brand color used for buttons, links, and active states"
          />
          <ColorPicker
            label="Accent Color"
            value={draft.accentColor}
            onChange={(c) => updateDraft({ accentColor: c })}
            description="Secondary color used for highlights and emphasis"
          />
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle className="text-base">Typography</CardTitle>
          <CardDescription>
            Choose the typeface used across your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FontSelector
            value={draft.fontFamily}
            onChange={(f) => updateDraft({ fontFamily: f })}
          />
        </CardContent>
      </Card>

      {/* Shape */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shape</CardTitle>
          <CardDescription>
            Control the roundness of buttons, cards, and inputs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadiusSlider
            value={draft.borderRadius}
            onChange={(r) => updateDraft({ borderRadius: r })}
          />
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>
            Set the default color mode for new sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModeSelector
            value={draft.defaultMode}
            onChange={(m) => updateDraft({ defaultMode: m })}
          />
        </CardContent>
      </Card>

      {/* Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand Assets</CardTitle>
          <CardDescription>
            Upload your logo and favicon for a fully branded experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AssetUpload
            label="Logo"
            description="Displayed in the sidebar. PNG, JPG, SVG, or WebP. Max 2MB."
            value={draft.logoUrl}
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            maxSizeLabel="2MB"
            onUpload={handleLogoUpload}
            onRemove={handleLogoRemove}
          />
          <Separator />
          <AssetUpload
            label="Favicon"
            description="Displayed in the browser tab. ICO, PNG, or SVG. Max 500KB."
            value={draft.faviconUrl}
            accept="image/x-icon,image/png,image/svg+xml,image/vnd.microsoft.icon"
            maxSizeLabel="500KB"
            onUpload={handleFaviconUpload}
            onRemove={handleFaviconRemove}
          />
        </CardContent>
      </Card>
    </div>
  );
}
