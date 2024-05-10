import React from "react";
import {Drawer} from "@/components/Drawer";
import {SearchField} from "@/components/SearchField";

export default function Home() {
  return (
    <div className={"flex flex-row"}>
        <Drawer></Drawer>
        <SearchField></SearchField>
    </div>

  );
}
