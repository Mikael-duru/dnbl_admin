import { Inter } from "next/font/google";

import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"] });

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className={inter.className}>
			<div className="flex max-xl:flex-col text-grey-1 bg-[#FEFEFEE5] dark:bg-[#1E1E1E]">
				<LeftSideBar />
				<TopBar />
				<div className="flex-1">{children}</div>
			</div>
		</div>
	);
}
