import { CaretDownIcon } from "@phosphor-icons/react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import clsx from "clsx";
import { useState } from "react";
import { Image } from "~/components/image";
import Link from "~/components/link";
import { RevealUnderline } from "~/components/reveal-underline";
import { useShopMenu } from "~/hooks/use-shop-menu";
import type { SingleMenuItem } from "~/types/menu";
import { cn } from "~/utils/cn";
import { DropdownMenu } from "./dropdown-menu";

export function DesktopMenu() {
  const { headerMenu } = useShopMenu();
  const [value, setValue] = useState<string>("");

  if (!headerMenu?.items?.length) {
    return null;
  }

  const items = headerMenu.items as unknown as SingleMenuItem[];

  return (
    <NavigationMenu.Root value={value} onValueChange={setValue}>
      <NavigationMenu.List
        className="hidden lg:flex items-center justify-center gap-8 h-full text-white"
      >
        {items.map((menuItem) => {
          const { id, items: childItems = [], title, to } = menuItem;
          const level = getMaxDepth(menuItem);
          const hasSubmenu = level > 1;
          const isDropdown =
            level === 2 &&
            childItems.every(({ resource }) => !resource?.image);

          if (isDropdown) {
            return <DropdownMenu key={id} menuItem={menuItem} />;
          }

          return (
            <NavigationMenu.Item key={id} value={id}>
              {hasSubmenu ? (
                <NavigationMenu.Trigger
                  className={clsx(
                    "flex items-center gap-1 px-4 py-4 text-lg font-semibold uppercase tracking-wide transition-colors",
                    "text-white hover:text-white/80 focus:text-white/80"
                  )}
                >
                  {title}
                  <CaretDownIcon className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </NavigationMenu.Trigger>
              ) : (
                <NavigationMenu.Link asChild>
                  <Link
                    to={to}
                    className="px-4 py-4 text-lg font-semibold uppercase tracking-wide text-white hover:text-white/80 transition-colors"
                  >
                    {title}
                  </Link>
                </NavigationMenu.Link>
              )}

              {hasSubmenu && (
                <NavigationMenu.Content
                  className={cn([
                    "absolute left-0 top-full w-full",
                    "px-4 lg:px-8 py-8 bg-(--color-header-bg)",
                    "shadow-lg border-t border-white/10",
                  ])}
                >
                  <MegaMenu items={childItems} />
                </NavigationMenu.Content>
              )}
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <div className="absolute inset-x-0 top-full flex w-full justify-center pointer-events-none">
        <NavigationMenu.Viewport
          className={cn(
            "relative origin-[top_center] overflow-hidden bg-(--color-header-bg)",
            "data-[state=closed]:animate-scale-out data-[state=open]:animate-scale-in",
            "transition-[width,height] duration-200",
            "border-t border-white/10",
            "pointer-events-auto"
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}

function MegaMenu({ items }: { items: SingleMenuItem[] }) {
  return (
    <div className="mx-auto flex max-w-(--page-width) gap-8 text-white">
      {items.map(({ id, title, to, items: children, resource }, idx) =>
        resource?.image && children.length === 0 ? (
          <SlideIn
            key={id}
            className="group/item relative aspect-square w-60 grow overflow-hidden bg-black/20 rounded-lg"
            style={{ "--idx": idx } as React.CSSProperties}
          >
            <Image
              sizes="auto"
              data={resource.image}
              className="transition-transform duration-300 group-hover/item:scale-[1.05]"
              width={300}
            />
            <NavigationMenu.Link asChild>
              <Link
                to={to}
                prefetch="intent"
                className="absolute inset-0 flex items-center justify-center text-center bg-black/20 group-hover/item:bg-black/40 transition-all duration-300 text-white font-medium"
              >
                {title}
              </Link>
            </NavigationMenu.Link>
          </SlideIn>
        ) : (
          <SlideIn
            key={id}
            className="grow space-y-4"
            style={{ "--idx": idx } as React.CSSProperties}
          >
            <NavigationMenu.Link asChild>
              <Link
                to={to}
                prefetch="intent"
                className="uppercase text-white text-base tracking-wide font-semibold"
              >
                <RevealUnderline>{title}</RevealUnderline>
              </Link>
            </NavigationMenu.Link>
            <div className="flex flex-col gap-2">
              {children.map((cItem) => (
                <NavigationMenu.Link asChild key={cItem.id}>
                  <Link
                    to={cItem.to}
                    prefetch="intent"
                    className="text-sm tracking-wide font-medium text-white/90 hover:text-white transition-colors"
                  >
                    {cItem.title}
                  </Link>
                </NavigationMenu.Link>
              ))}
            </div>
          </SlideIn>
        )
      )}
    </div>
  );
}

function SlideIn(props: {
  className?: string;
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  const { className, children, style } = props;
  return (
    <div
      className={cn(
        "[animation-delay:calc(var(--idx)*100ms+100ms)]",
        "[--slide-left-from:40px] [animation-duration:200ms] animate-slide-left",
        "opacity-0",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function getMaxDepth(item: { items: any[] }): number {
  return item.items?.length > 0
    ? Math.max(...item.items.map(getMaxDepth)) + 1
    : 1;
}
