"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="bg-white">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] dark:text-black rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="mt-3 bg-white">
				<DropdownMenuItem
					onClick={() => setTheme("light")}
					className="font-open-sans font-normal text-xl leading-8 tracking-[0.01em] text-figure-text cursor-pointer hover:bg-[#B47B2B] hover:text-white"
				>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("dark")}
					className="font-open-sans font-normal text-xl leading-8 tracking-[0.01em] text-figure-text cursor-pointer hover:bg-[#B47B2B] hover:text-white"
				>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => setTheme("system")}
					className="font-open-sans font-normal text-xl leading-8 tracking-[0.01em] text-figure-text cursor-pointer hover:bg-[#B47B2B] hover:text-white"
				>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
