import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { X, ChevronRight, ChevronDown } from "lucide-react";
import { MENU_CONFIG, MenuItem } from "@/config/menuConfig";
import { ScrollArea } from "@/components/ui/scroll-area";

const MenuItemNode = ({
  item,
  depth = 0,
  openTab,
  closeSidebar,
}: {
  item: MenuItem;
  depth?: number;
  openTab: (tab: { title: string; component: string }) => void;
  closeSidebar: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = !!item.children?.length;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <div>
        <button
          className="flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded hover:bg-accent text-left"
          style={{ paddingLeft: `${12 + depth * 14}px` }}
          onClick={() => setExpanded((p) => !p)}
        >
          <Icon size={14} className="text-primary shrink-0" />
          <span className="flex-1 truncate">{item.title}</span>
          {expanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
        </button>
        {expanded && (
          <div>
            {item.children!.map((child) => (
              <MenuItemNode
                key={child.id}
                item={child}
                depth={depth + 1}
                openTab={openTab}
                closeSidebar={closeSidebar}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className="flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded hover:bg-accent text-left"
      style={{ paddingLeft: `${12 + depth * 14}px` }}
      onClick={() => {
        openTab({ title: item.title, component: item.id });
        closeSidebar();
      }}
    >
      <Icon size={14} className="text-primary shrink-0" />
      <span className="truncate">{item.title}</span>
    </button>
  );
};

const SidebarMenu = () => {
  const { XSidebarOpen, closeSidebar, openTab } = useAppContext();

  if (!XSidebarOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-40" onClick={closeSidebar} />
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-card shadow-lg z-50 animate-slide-in flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-border bg-topbar text-topbar-foreground">
          <span className="font-semibold text-sm">Menu Principal</span>
          <button onClick={closeSidebar} className="p-1 hover:bg-foreground/10 rounded">
            <X size={18} />
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {MENU_CONFIG.map((item) => (
              <MenuItemNode
                key={item.id}
                item={item}
                openTab={openTab}
                closeSidebar={closeSidebar}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default SidebarMenu;
