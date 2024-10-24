import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					"flex min-h-[80px] w-full rounded-md border border-gray-400 bg-background px-3 py-2 text-sm ring-offset-background dark:text-[#FDFDFD] placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B47B2B]  disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Textarea.displayName = "Textarea";

export { Textarea };
