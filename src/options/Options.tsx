import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Pencil, Copy } from "lucide-react";

function Options() {
  const [utmParams, setUtmParams] = useState<string[]>([]);
  const [newParam, setNewParam] = useState("");
  const [jsonView, setJsonView] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  // Load initial settings
  useEffect(() => {
    chrome.storage.local.get(['utmParams'], (result) => {
      if (result.utmParams) {
        setUtmParams(result.utmParams);
        setJsonView(JSON.stringify(result.utmParams, null, 2));
      }
    });
  }, []);

  // Update JSON view when UTM params change
  useEffect(() => {
    setJsonView(JSON.stringify(utmParams, null, 2));
  }, [utmParams]);

  const handleAddParam = () => {
    if (newParam.trim() && !utmParams.includes(newParam.trim())) {
      const updatedParams = [...utmParams, newParam.trim()];
      setUtmParams(updatedParams);
      setNewParam("");
    }
  };

  const handleSave = () => {
    chrome.storage.local.set({ utmParams }, () => {
      chrome.runtime.sendMessage({ type: "settingsUpdated" });
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-600 underline">
        Options
      </h1>

      <div className="space-y-4">
        <div>
          <Label htmlFor="utm-params">UTM Parameters</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="utm-params"
              value={newParam}
              onChange={(e) => setNewParam(e.target.value)}
              placeholder="Add new UTM parameter"
            />
            <Button onClick={handleAddParam}>Add</Button>
          </div>
        </div>

        <div>
          <Label>JSON View</Label>
          <div className="flex items-start gap-2">
            <Textarea
              value={jsonView}
              readOnly
              className="mt-2 h-32 font-mono text-sm flex-1"
            />
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="mt-2"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(jsonView);
                  } catch (error) {
                    console.error("Failed to copy:", error);
                  }
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
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
                          const parsed = JSON.parse(editValue);
                          if (Array.isArray(parsed)) {
                            setUtmParams(parsed);
                            setJsonView(JSON.stringify(parsed, null, 2));
                            setIsEditing(false);
                          }
                        } catch (error) {
                          console.error("Invalid JSON:", error);
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
