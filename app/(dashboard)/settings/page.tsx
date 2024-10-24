"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/ui/light-and-dark-toggle";
import { Separator } from "@/components/ui/separator";

const languages = [
	{ code: "en", name: "English" },
	// { code: "es", name: "Español" },
	// { code: "fr", name: "Français" },
	// { code: "de", name: "Deutsch" },
	// { code: "it", name: "Italiano" },
];

function Settings() {
	const router = useRouter();
	const [language, setLanguage] = useState("en");

	const handleLanguageChange = (value: any) => {
		setLanguage(value);
		console.log(`Language changed to ${value}`);
	};

	return (
		<main className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			<h2 className="text-heading2-bold dark:text-gray-300 font-inter">
				Settings
			</h2>
			<Separator className="bg-grey-1 mt-5 mb-10" />

			{/* Main content area */}
			<div className="w-3/4 max-lg:w-full bg-white dark:bg-[#2e2e2e] px-4 sm:px-6 rounded-[10px] py-14 shadow-custom">
				<div className="flex flex-col justify-center gap-4">
					{/* Language Preferences */}
					<div className="border-b-2 border-black dark:border-white pb-[10px]">
						<div className="flex gap-3 sm:items-center justify-between">
							<div className="w-10 h-10 border rounded-lg bg-black flex justify-center items-center shrink-0">
								<Image src="/global.svg" width={24} height={24} alt="" />
							</div>
							<div className="flex-1 flex flex-wrap items-center justify-between gap-3 sm:gap-6">
								<p className="font-open-sans font-normal text-lg sm:text-xl sm:leading-8 tracking-[0.01em] text-figure-text dark:text-white">
									Language preferences
								</p>
								<Select
									onValueChange={handleLanguageChange}
									defaultValue={language}
								>
									<SelectTrigger className="w-[140px]">
										<SelectValue
											placeholder="Select language"
											className="font-open-sans font-normal text-base leading-8 tracking-[0.01em] text-figure-text dark:text-white"
										/>
									</SelectTrigger>
									<SelectContent>
										{languages.map((lang) => (
											<SelectItem key={lang.code} value={lang.code}>
												{lang.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>

					{/* Dark Mode */}
					<div className="border-b-2 border-black dark:border-white pb-[10px]">
						<div className="flex items-center justify-between">
							<div className="flex gap-3 items-center">
								<div className="w-10 h-10 border rounded-lg bg-black flex justify-center items-center shrink-0">
									<Image src="/devices.svg" width={24} height={24} alt="" />
								</div>
								<p className="font-open-sans font-normal text-xl leading-8 tracking-[0.01em] text-figure-text dark:text-white">
									Dark mode
								</p>
							</div>
							<ModeToggle />
						</div>
					</div>

					{/* Authentication and Security */}
					<div className="border-b-2 border-black dark:border-white pb-[10px]">
						<div className="flex gap-3 sm:items-center justify-between">
							<div className="w-10 h-10 border rounded-lg bg-black flex justify-center items-center shrink-0">
								<Image src="/Frame.svg" width={24} height={24} alt="" />
							</div>
							<div
								className="flex-1 flex items-center justify-between gap-3 sm:gap-6 cursor-pointer"
								onClick={() => router.push("/settings/change-password")}
							>
								<p className="font-open-sans font-normal text-lg sm:text-xl sm:leading-8 tracking-[0.01em] text-figure-text dark:text-white">
									Change Password
								</p>
								<ChevronRight className="w-6 h-6 sm:h-8 sm:w-8" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export default Settings;
