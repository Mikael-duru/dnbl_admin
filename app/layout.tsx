import type { Metadata } from "next";
import "./globals.css";
import { ToasterProvider } from "@/lib/ToasterProvider";
import { Providers } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
	title: "DNBL - Admin Dashboard",
	description: "Admin dashboard to manage DNBL's data",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-[#2e2e2e] dark:bg-black">
				<Providers>
					<ToasterProvider />
					<div className="container mx-auto">{children}</div>
				</Providers>
			</body>
		</html>
	);
}
