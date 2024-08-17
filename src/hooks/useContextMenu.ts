import React, { useState, useCallback, useEffect } from 'react';

interface ContextMenuState<T> {
    id: number;
    x: number;
    y: number;
    visible: boolean;
    item: T | null;
}

export function useContextMenu<T extends { id: number }>() {
    const [contextMenu, setContextMenu] = useState<ContextMenuState<T>>({id: 0, x: 0, y: 0, visible: false, item: null});

    const closeContextMenu = useCallback(() => {
        setContextMenu(prev => ({ ...prev, visible: false, item: null }));
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement>, item: T) => {
        e.preventDefault();
        e.stopPropagation();

        const isButton = e.target instanceof HTMLButtonElement || e.target instanceof SVGElement;

        if (contextMenu.visible && contextMenu.id === item.id) {
            setContextMenu({ ...contextMenu, visible: false, item: null });
            closeContextMenu();

        } else {
            let newContextMenu;

            if (e.type === "click" && isButton) {
                const buttonElement = e.currentTarget;
                const rect = buttonElement.getBoundingClientRect();

                newContextMenu = {
                    id: item.id,
                    x: rect.left - 66,
                    y: rect.top + 34,
                    visible: true,
                    item: item
                };
                setContextMenu(newContextMenu);

            } else if (e.type === "contextmenu" && !isButton) {
                newContextMenu = {
                    id: item.id,
                    x: e.clientX,
                    y: e.clientY,
                    visible: true,
                    item: item
                };
                setContextMenu(newContextMenu);
            }

        }
    }, [closeContextMenu, contextMenu]);

    return {
        contextMenu,
        handleContextMenu,
        closeContextMenu
    };
}