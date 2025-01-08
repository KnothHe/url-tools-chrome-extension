import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  loadInitialSettings,
  addUTMParam,
  saveSettings,
  updateJsonView,
  editJson,
} from "@/utils/optionsService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Copy, Plus, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Options() {
  const [utmParams, setUtmParams] = useState<string[]>([]);
  const [newParam, setNewParam] = useState("");
  const [jsonView, setJsonView] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  // Load initial settings
  useEffect(() => {
    loadInitialSettings().then((params) => {
      setUtmParams(params);
      setJsonView(updateJsonView(params));
    });
  }, []);

  // Update JSON view when UTM params change
  useEffect(() => {
    setJsonView(updateJsonView(utmParams));
  }, [utmParams]);

  const handleAddParam = async () => {
    if (newParam.trim()) {
      const updatedParams = await addUTMParam(utmParams, newParam.trim());
      setUtmParams(updatedParams);
      setNewParam("");
    }
  };

  const handleSave = async () => {
    await saveSettings(utmParams);
    alert("Options saved successfully!");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-600 underline">
        Options
      </h1>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Label>UTM Parameters JSON View</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p className="text-sm">
                    This shows your UTM parameters in JSON format. JSON is a
                    structured way to represent data that both humans and
                    computers can understand. Each parameter is listed as a
                    string in an array.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-start gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Textarea
                    value={jsonView}
                    readOnly
                    className="mt-2 h-32 font-mono text-sm flex-1"
                  />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  <p className="text-sm">
                    The square brackets [ ] indicate an array, and each
                    parameter is wrapped in quotes. This format ensures your
                    parameters can be properly saved and used by the extension.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex flex-col gap-1">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                    onClick={() => setEditValue(jsonView)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="mt-2">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add UTM Parameter</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          value={newParam}
                          onChange={(e) => setNewParam(e.target.value)}
                          placeholder="Enter new UTM parameter"
                        />
                        <Button
                          onClick={handleAddParam}
                          disabled={!newParam.trim()}
                        >
                          Add Parameter
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </DialogTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-2"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(jsonView);
                    } catch (error) {
                      console.log("Failed to copy:", error);
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit JSON</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-48 font-mono text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        try {
                          const parsed = editJson(editValue);
                          setUtmParams(parsed);
                          setJsonView(updateJsonView(parsed));
                          setIsEditing(false);
                        } catch (error: unknown) {
                          if (error instanceof Error) {
                            console.log(error.message);
                          } else {
                            console.log('An unknown error occurred');
                          }
                        }
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button className="w-full" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}

export default Options;
