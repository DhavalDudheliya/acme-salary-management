import { Inbox } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@supporthub/ui/components/card";

export function HowItWorksCard() {
  return (
    <Card className="bg-primary/5 border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Inbox className="h-5 w-5 text-primary" />
          How it works
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              1
            </span>
            <span>Connect your Gmail or Outlook account via OAuth</span>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              2
            </span>
            <span>Inbound emails are automatically detected in real time</span>
          </div>
          <div className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              3
            </span>
            <span>
              Emails become tickets; replies thread into existing tickets
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
