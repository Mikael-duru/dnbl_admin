"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

import { navLinks } from "@/lib/constants";
import { auth, db } from "@/firebase/firebase";
import { getDoc, doc, setDoc, onSnapshot } from "firebase/firestore";
import { LogOut, UserRound, UserRoundCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LeftSideBar = () => {
	const pathname = usePathname();
	const [user, setUser] = useState<User | null>(null);
	const [userFirstName, setUserFirstName] = useState<string | null>(null);
	const [userLastName, setUserLastName] = useState<string | null>(null);
	const [photoURL, setPhotoURL] = useState<string>("");
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
									setUserFirstName(userData.displayName || ""); // Update first name
									setUserLastName(userData.displayName || ""); // Update last name
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
						setUserFirstName(userData.firstName || ""); // Default to empty if not available
						setUserLastName(userData.lastName || ""); // Default to empty if not available
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
				setUserFirstName(""); // Clear display name
				setUserLastName(""); // Clear display name
				setPhotoURL(""); // Clear photo URL
			}
		});

		// Clean up the authentication listener when the component unmounts
		return () => unsubscribe();
	}, []); // Empty dependency array means this effect runs once on mount

	const handleLogout = async () => {
		try {
			await signOut(auth);
			setUser(null);
			setUserFirstName("");
			setUserLastName("");
			setPhotoURL("");
			toast.success("You have been signed out.");
			Cookies.remove("auth");
			router.push("/sign-in");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<div className="h-screen w-[270px] border-r border-r-[#B47B2B] left-0 top-0 sticky p-10 flex flex-col gap-12 bg-[#FDFDFD] dark:bg-[#2E2E2E] shadow-xl overflow-hidden max-xl:hidden">
			<Image
				src="/logo-black.svg"
				alt="logo"
				width={200}
				height={200}
				className="w-[130px] h-[65px] dark:invert"
			/>

			<ul className="flex-1 flex flex-col gap-3">
				{navLinks.map((link) => (
					<Link
						href={link.url}
						key={link.label}
						className={`flex items-center gap-4 font-inter text-body-medium p-3 ${
							pathname === link.url
								? "text-white bg-[#3E3E3E] dark:bg-gray-300 dark:text-black"
								: "text-[#3E3E3E] dark:text-gray-300"
						} hover:text-white hover:bg-[#3E3E3E] rounded-md`}
					>
						{link.icon} <p>{link.label}</p>
					</Link>
				))}
			</ul>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex gap-4 items-center cursor-pointer">
						{/* profile picture */}
						<Avatar className="w-12 h-12 shrink-0">
							<AvatarImage
								src={photoURL || (user?.photoURL as string)}
								alt={"User profile picture"}
							/>
							<AvatarFallback>
								<UserRoundCheck size={24} />
							</AvatarFallback>
						</Avatar>

						{/* Name and email */}
						<div className="flex-1 shrink-0">
							<h1 className="font-inter text-body-medium dark:text-grey-1">
								{userFirstName}{" "}
								{userLastName ? userLastName[0].toUpperCase() + "." : ""}
							</h1>
							<p className="font-inter font-normal text-base dark:text-gray-300">
								Admin
							</p>
						</div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="bg-white dark:bg-[#1E1E1E] my-4">
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
	);
};

export default LeftSideBar;
