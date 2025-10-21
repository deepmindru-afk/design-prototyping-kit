"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronTopIcon, ChevronBottomIcon } from "@/icons/react";

// TypeScript interfaces
export interface HistoryItem {
  id: string;
  timestamp: string;
  userEmail: string;
  changes: string[];
  isDeployed?: boolean;
}

// Mock history data for prototype
const mockHistoryData: HistoryItem[] = [
  {
    id: "1",
    timestamp: "2 hours ago",
    userEmail: "dylan@example.com",
    changes: [
      "Updated system instructions",
      "Modified greeting behavior",
      "Changed response tone to friendly",
    ],
    isDeployed: true,
  },
  {
    id: "2",
    timestamp: "5 hours ago",
    userEmail: "sarah@example.com",
    changes: [
      "Changed voice to Alloy",
      "Updated audio settings",
    ],
  },
  {
    id: "3",
    timestamp: "Yesterday",
    userEmail: "dylan@example.com",
    changes: [
      "Modified welcome message",
      "Added user context handling",
      "Updated error responses",
      "Changed timeout settings",
    ],
  },
  {
    id: "4",
    timestamp: "2 days ago",
    userEmail: "mike@example.com",
    changes: [
      "Enabled greeting prompt",
    ],
  },
  {
    id: "5",
    timestamp: "3 days ago",
    userEmail: "dylan@example.com",
    changes: [
      "Updated language to Spanish",
      "Modified translation settings",
      "Changed locale preferences",
    ],
  },
];

// Individual Change Item Component
interface ChangeItemProps {
  text: string;
  isFirst: boolean;
  isLast: boolean;
}

function ChangeItem({ text, isFirst, isLast }: ChangeItemProps) {
  return (
    <div
      className={cn(
        "border border-separator2 px-2 py-1.5 -mb-px",
        isFirst && "rounded-t",
        isLast && "rounded-b"
      )}
    >
      <p className="text-xs font-normal text-fg3 leading-[1.5]">{text}</p>
    </div>
  );
}

// History List Item Component
interface HistoryListItemProps {
  item: HistoryItem;
  isSelected: boolean;
  onSelect: () => void;
}

function HistoryListItem({ item, isSelected, onSelect }: HistoryListItemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Safety check: ensure changes array exists
  const changes = item.changes || [];

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = () => {
    onSelect();
  };

  return (
    <div
      onClick={handleItemClick}
      className={cn(
        "bg-bg2 border border-separator1 rounded p-3 flex flex-col gap-2 transition-all cursor-pointer",
        "hover:bg-bg3",
        isSelected && "ring-1 ring-fgAccent1"
      )}
    >
      {/* Header: Date/Time + User Email + Badge */}
      <div className="flex items-start gap-2 w-full">
        <div className="flex-1 flex flex-col items-start gap-0 min-w-0">
          <p className="text-sm font-semibold text-fg1 leading-[1.5]">
            {item.timestamp}
          </p>
          <p className="text-xs font-normal text-fg3 leading-[1.5]">
            {item.userEmail}
          </p>
        </div>
        {item.isDeployed && (
          <div className="flex-shrink-0">
            <div className="bg-bgSuccess1 text-fgSuccess border border-separatorSuccess rounded px-1.5 py-1 flex items-center justify-center">
              <p className="text-[10px] font-semibold uppercase leading-[1.5]">
                DEPLOYED VERSION
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Changes List */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <div className="w-full overflow-clip rounded">
            {changes.map((change, index) => (
              <ChangeItem
                key={index}
                text={change}
                isFirst={index === 0}
                isLast={index === changes.length - 1}
              />
            ))}
          </div>
        </CollapsibleContent>

        {/* Footer: Change Count + Expand/Collapse Button */}
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1">
            <p className="text-xs font-normal text-fg3 leading-[1.5]">
              {changes.length} {changes.length === 1 ? "change" : "changes"}
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className="h-7 w-8 flex items-center justify-center rounded hover:bg-bg3 transition-colors"
            >
              {isExpanded ? (
                <ChevronTopIcon className="w-3 h-3 text-fg1" />
              ) : (
                <ChevronBottomIcon className="w-3 h-3 text-fg1" />
              )}
            </button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
}

// Main Edit History Panel Component
export interface EditHistoryPanelProps {
  trigger?: React.ReactNode;
  historyItems?: HistoryItem[];
  currentUserEmail?: string;
  onRevert?: (historyItem: HistoryItem) => void;
}

export default function EditHistoryPanel({
  trigger,
  historyItems,
  currentUserEmail: _currentUserEmail = "dylan@example.com",
  onRevert,
}: EditHistoryPanelProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Use provided history items or fallback to mock data
  const displayItems = historyItems || mockHistoryData;

  const handleRevert = () => {
    const selectedItem = displayItems.find((item) => item.id === selectedId);
    if (selectedItem && onRevert) {
      onRevert(selectedItem);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            View edit history
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] bg-bg1 border-l border-separator1 p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <div className="flex flex-col gap-0.5 px-6 pt-6 pb-5 flex-shrink-0">
          <SheetTitle className="text-lg font-semibold text-fg0 leading-[1.5]">
            Edit history
          </SheetTitle>
          <SheetDescription className="text-sm font-normal text-fg2 leading-[1.5]">
            Review the changes made to your agent and convert back to a previous
            iteration.
          </SheetDescription>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto px-6 pb-6 pt-1 min-h-0">
          {displayItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-fg3">No edit history yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {displayItems.map((item) => (
                <HistoryListItem
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onSelect={() => setSelectedId(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-separator1 px-6 py-4 flex items-center justify-end gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-7 px-3 text-fg1 hover:bg-bg2 font-semibold text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleRevert}
            disabled={!selectedId}
            className="h-7 px-3 bg-fgAccent1 text-bg1 hover:bg-fgAccent1/90 font-semibold text-xs"
          >
            Revert to selected
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

