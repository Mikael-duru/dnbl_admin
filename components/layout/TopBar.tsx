"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, UserRound, UserRoundCheck } from "lucide-react";
import Cookies from "js-cookie";

import { navLinks } from "@/lib/constants";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

const TopBar = () => {
	const [user, setUser] = useState<User | null>(null);
	const [photoURL, setPhotoURL] = useState<string>("");
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		// Set up an authentication state listener
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// User is signed in; update user state
				setUser(user);

				// Reference to the user's document in Firestore
				const userDocRef = doc(db, "users", user.uid);

				// Listen for real-time updates to the user's document in Firestore
				const unsubscribeDoc = onSnapshot(userDocRef, async (doc) => {
					if (!doc.exists()) {
						try {
							const googleStoredData = localStorage.getItem("GoogleData");
							const facebookStoredData = localStorage.getItem("FacebookData");

							// Parse both Google and Facebook data
							const parsedGoogleData = googleStoredData
								? JSON.parse(googleStoredData)
								: null;
							const parsedFacebookData = facebookStoredData
								? JSON.parse(facebookStoredData)
								: null;

							let userDataToSave = null;

							// Check if Google data matches user UID
							if (parsedGoogleData && parsedGoogleData.id === user.uid) {
								userDataToSave = parsedGoogleData;
							}
							// Check if Facebook data matches user UID
							else if (
								parsedFacebookData &&
								parsedFacebookData.id === user.uid
							) {
								userDataToSave = parsedFacebookData;
							}

							if (userDataToSave) {
								await setDoc(userDocRef, userDataToSave);

								// Remove social data from localStorage after saving
								localStorage.removeItem("GoogleData");
								localStorage.removeItem("FacebookData");

								// Fetch user data from Firestore again to update local state
								const updatedUserDoc = await getDoc(userDocRef);
								if (updatedUserDoc.exists()) {
									const userData = updatedUserDoc.data();
									setPhotoURL(userData.photoURL || ""); // Update photo URL
								}
							} else {
								console.error("No matching user data found in localStorage"); // Log error if no match found
							}
						} catch (error) {
							// Log any errors that occur during retrieval or saving of user data
							console.error("Error retrieving or saving user data:", error);
						}
					} else {
						// Update local state with user data from Firestore
						const userData = doc.data();
						setPhotoURL(userData.photoURL || ""); // Default to empty if not available
						localStorage.removeItem("GoogleData");
						localStorage.removeItem("FacebookData");
					}
				});

				// Clean up the Firestore listener when the component unmounts
				return () => unsubscribeDoc();
			} else {
				// User is signed out; reset state
				setUser(null); // Clear user state
				setPhotoURL(""); // Clear photo URL
			}
		});

		// Clean up the authentication listener when the component unmounts
		return () => unsubscribe();
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			setUser(null);
			setPhotoURL("");
			toast.success("You have signed out.");
			Cookies.remove("auth");
			router.push("/sign-in");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<div className="sticky top-0 z-20 w-full border-b border-b-[#B47B2B] flex justify-between items-center px-[5%] sm:px-[4%] py-4 bg-[#FDFDFD] dark:bg-[#2E2E2E] shadow-xl xl:hidden">
			<Image
				src="/logo-black.svg"
				alt="logo"
				width={200}
				height={200}
				className="w-[100px] h-[65px] dark:invert"
			/>

			<div className="flex gap-8 max-lg:hidden">
				{navLinks.map((link) => (
					<Link
						href={link.url}
						key={link.label}
						className={`flex gap-4 font-inter text-body-medium text-[#3E3E3E] dark:text-gray-300 pb-1 ${
							pathname === link.url
								? "border-b-2 border-b-gray-300 dark:hover:text-gray-300"
								: "border-b-0"
						} hover:text-black dark:hover:text-white`}
					>
						<p>{link.label}</p>
					</Link>
				))}
			</div>

			<div className="relative flex gap-4 items-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Menu className="cursor-pointer lg:hidden dark:text-gray-300" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-[#FDFDFD] dark:bg-[#1E1E1E] dark:border-[#B47B2B] p-5 m-4">
						{navLinks.map((link) => (
							<DropdownMenuItem key={link.label}>
								<Link
									className={`flex items-center gap-6 font-inter text-body-medium w-full py-2 px-5 ${
										pathname === link.url
											? "text-white bg-[#3E3E3E] dark:bg-gray-300 dark:text-black"
											: "text-[#3E3E3E] dark:text-white"
									} hover:text-white hover:bg-[#3E3E3E] rounded-md`}
									href={link.url}
								>
									{link.icon} {link.label}
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Avatar className="w-12 h-12 shrink-0 cursor-pointer">
							<AvatarImage
								src={photoURL || (user?.photoURL as string)}
								alt={"User profile picture"}
							/>
							<AvatarFallback>
								<UserRoundCheck size={24} />
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-white dark:bg-[#1E1E1E] dark:border-[#B47B2B] mt-1 mx-4">
						<DropdownMenuItem className="cursor-pointer mb-1 dark:hover:bg-[#2E2E2E]">
							<Link
								href={"/my-account"}
								className="flex items-center gap-2 dark:text-gray-300 py-2 pl-4 pr-20 text-body-medium"
							>
								<UserRound />
								My Profile
							</Link>
						</DropdownMenuItem>

						<DropdownMenuItem className="cursor-pointer text-red-500 dark:text-red-500 dark:hover:bg-[#2E2E2E]">
							<button
								onClick={handleLogout}
								className="flex items-center gap-2 py-2 pl-4 pr-24 text-body-medium"
							>
								<LogOut />
								Log out
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};

export default TopBar;
