import { Loader2, Palette, RotateCcw, Save } from "lucide-react";
import { Button } from "@supporthub/ui/components/button";

interface BrandingSettingsHeaderProps {
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasPreview: boolean;
}

export function BrandingSettingsHeader({
  onReset,
  onSave,
  isSaving,
  hasPreview,
}: BrandingSettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          Branding
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the look and feel of your workspace
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onReset}
          disabled={!hasPreview || isSaving}
          className="gap-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button
          onClick={onSave}
          disabled={!hasPreview || isSaving}
          className="gap-1.5"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
