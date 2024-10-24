"use client";

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface MultiSelectProps {
	placeholder: string;
	collections: CollectionType[];
	value: string[];
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
	placeholder,
	collections,
	value,
	onChange,
	onRemove,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);

	let selected: CollectionType[];

	if (value.length === 0) {
		selected = [];
	} else {
		selected = value.map((id) =>
			collections.find((collection) => collection._id === id)
		) as CollectionType[];
	}

	const selectables = collections.filter(
		(collection) => !selected.includes(collection)
	);

	return (
		<Command className="overflow-visible dark:border-[#B47B2B]">
			<form className="flex gap-1 flex-wrap border border-gray-400 hover:border-transparent hover:ring-1 hover:ring-[#B47B2B] rounded-md bg-[#FDFDFD] dark:bg-black">
				{selected.map((collection) => (
					<Badge key={collection._id} className="dark:text-white font-inter">
						{collection.title}
						<button
							type="button"
							className="ml-1 hover:text-red-1"
							onClick={() => onRemove(collection._id)}
						>
							<X className="h-3 w-3" />
						</button>
					</Badge>
				))}

				<CommandInput
					placeholder={placeholder}
					value={inputValue}
					onValueChange={setInputValue}
					onBlur={() => setOpen(false)}
					onFocus={() => setOpen(true)}
				/>
			</form>

			<div className="relative mt-2">
				{open && (
					<CommandList className="absolute w-full z-30 top-0 overflow-auto rounded-md shadow-md bg-[#fdfdfd] dark:bg-[#1e1e1e]">
						{selectables.map((collection) => (
							<CommandItem
								key={collection._id}
								onMouseDown={(e) => e.preventDefault()}
								onSelect={() => {
									onChange(collection._id);
									setInputValue("");
								}}
								className="hover:bg-grey-2 dark:text-gray-300 cursor-pointer font-inter"
							>
								{collection.title}
							</CommandItem>
						))}
					</CommandList>
				)}
			</div>
		</Command>
	);
};

export default MultiSelect;
