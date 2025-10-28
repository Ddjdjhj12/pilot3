import { CaretRightIcon, ListIcon, XIcon } from "@phosphor-icons/react";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Dialog from "@radix-ui/react-dialog";
import Link from "~/components/link";
import { ScrollArea } from "~/components/scroll-area";
import { useShopMenu } from "~/hooks/use-shop-menu";
import type { SingleMenuItem } from "~/types/menu";
import { cn } from "~/utils/cn";

export function MobileMenu() {
  const { headerMenu } = useShopMenu();

  if (!headerMenu) {
    return <MenuTrigger />;
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        asChild
        className="relative flex h-8 w-8 items-center justify-center focus-visible:outline-hidden lg:hidden text-white"
      >
        <MenuTrigger />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-fade-in fixed inset-0 z-10 bg-black/50" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn([
            "-translate-x-full left-0",
            "data-[state=open]:translate-x-0 data-[state=open]:animate-enter-from-left",
            "fixed inset-0 z-10 h-screen-no-topbar bg-(--color-header-bg)",
            "pt-4 pb-2 px-4 focus-visible:outline-hidden uppercase text-white",
          ])}
          aria-describedby={undefined}
        >
          <Dialog.Title asChild>
            <div className="text-xl font-semibold tracking-wide mb-3">MENU</div>
          </Dialog.Title>

          <Dialog.Close asChild>
            <XIcon className="fixed top-4 right-4 h-6 w-6 text-white" />
          </Dialog.Close>

          <div className="h-px bg-white/20 mb-4" />

          <ScrollArea className="h-[calc(100vh-6rem)]">
            <ul className="space-y-2">
              {headerMenu.items.map((item) => (
                <CollapsibleMenuItem
                  key={item.id}
                  item={item as unknown as SingleMenuItem}
                />
              ))}
            </ul>
          </ScrollArea>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CollapsibleMenuItem({ item }: { item: SingleMenuItem }) {
  const { title, to, items } = item;

  if (!items?.length) {
    return (
      <Dialog.Close asChild>
        <li>
          <Link
            to={to}
            className="block w-full py-4 text-lg tracking-wide font-semibold text-white hover:text-white/70 transition-colors"
          >
            {title}
          </Link>
        </li>
      </Dialog.Close>
    );
  }

  return (
    <Collapsible.Root>
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 py-4 text-lg font-semibold text-white transition-colors data-[state=open]:text-white/80"
        >
          <span>{title}</span>
          <CaretRightIcon className="h-5 w-5 transition-transform duration-200 data-[state=open]:rotate-90" />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="pl-4 border-l border-white/20 space-y-1">
        {items.map((childItem) => (
          <li key={childItem.id}>
            <Dialog.Close asChild>
              <Link
                to={childItem.to}
                className="block w-full py-3 text-base text-white/90 hover:text-white transition-colors"
              >
                {childItem.title}
              </Link>
            </Dialog.Close>
          </li>
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function MenuTrigger(props: Dialog.DialogTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) {
  const { ref, ...rest } = props;
  return (
    <button ref={ref} type="button" {...rest}>
      <ListIcon className="h-5 w-5" />
    </button>
  );
}
