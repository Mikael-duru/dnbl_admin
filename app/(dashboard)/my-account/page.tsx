"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { UserRoundCheck } from "lucide-react";
import type { User } from "firebase/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

function UserDashboard() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [userName, setUserName] = useState<string | null>(null);
	const [userAddress, setUserAddress] = useState<string | null>(null);
	const [userCountry, setUserCountry] = useState<string | null>(null);
	const [userCity, setUserCity] = useState<string | null>(null);
	const [userPhone, setUserPhone] = useState<string | null>(null);
	const [photoURL, setPhotoURL] = useState<string>("");

	useEffect(() => {
		// Set up an authentication state listener
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				// User is signed in; update user state
				setUser(user);

				// Reference to the user's document in Firestore
				const userDocRef = doc(db, "users", user.uid);

				// Listen for real-time updates to the user's document in Firestore
				const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
					if (doc.exists()) {
						// Update local state with user data from Firestore
						const userData = doc.data();
						setUserName(userData.displayName || ""); // Default to empty if not available
						setUserAddress(userData.address || ""); // Default to empty if not available
						setUserCountry(userData.country || ""); // Default to empty if not available
						setUserCity(userData.city || ""); // Default to empty if not available
						setUserPhone(userData.phoneNumber || ""); // Default to empty if not available
						setPhotoURL(userData.photoURL || ""); // Default to empty if not available
					} else {
						console.error("User document does not exist."); // Log error if document is missing
					}
				});

				// Clean up the Firestore listener when the component unmounts
				return () => {
					unsubscribeDoc(); // Unsubscribe from the Firestore listener
				};
			} else {
				// User is signed out; reset state
				setUser(null); // Clear user state
				setUserName(""); // Clear display name
				setUserAddress(""); // Clear address
				setUserCountry(""); // Clear country
				setUserCity(""); // Clear city
				setUserPhone(""); // Clear phone number
				setPhotoURL(""); // Clear photo URL
			}
		});

		// Clean up the authentication listener when the component unmounts
		return () => unsubscribe();
	}, []); // Empty dependency array means this effect runs once on mount

	return (
		<section className="py-10 px-[5%] xl:px-10 xl:pt-14 xl:pb-10">
			{/* Main content area */}
			<div className="bg-white dark:bg-[#2e2e2e] shadow-custom rounded-[10px] px-4 sm:px-6 pt-4 pb-[35px]">
				{/* User Info */}
				<div className="flex max-sm:flex-col gap-4 justify-between items-start sm:items-center">
					{user ? (
						<Avatar className="w-[150px] h-[150px] sm:w-[167px] sm:h-[167px] rounded-full">
							<AvatarImage
								src={photoURL || (user?.photoURL as string)}
								alt={"User profile picture"}
							/>
							<AvatarFallback className="text-7xl font-libre-franklin tracking-wide">
								<UserRoundCheck size={70} />
							</AvatarFallback>
						</Avatar>
					) : (
						<Avatar className="w-[150px] h-[150px] sm:w-[167px] sm:h-[167px] rounded-full">
							<AvatarFallback className="text-7xl font-libre-franklin tracking-wide">
								<UserRoundCheck size={70} />
							</AvatarFallback>
						</Avatar>
					)}
					<button
						onClick={() => router.push("/my-account/edit-profile")}
						type="button"
						className="text-[#B47B2B] font-inter font-normal text-xl leading-[27.24px] capitalize hover:underline lg:pr-10"
					>
						edit information
					</button>
				</div>
				<div className="mt-2">
					<h2 className="font-inter font-normal text-lg text-black dark:text-white sm:pb-2">
						{user?.displayName || userName}
					</h2>
					<p className="font-inter font-normal text-sm leading-[28px] text-black dark:text-white">
						{user?.email}
					</p>
				</div>

				{/* Form */}
				<form className="grid grid-cols-1 md:grid-cols-2 gap-6  mt-[30px]">
					{/* Address */}
					<div>
						<label
							htmlFor="userAddress"
							className="font-inter font-normal text-base leading-[28px] text-black dark:text-white mb-4"
						>
							Address
						</label>
						<input
							id="userAddress"
							value={userAddress || ""}
							className="w-full pt-2 px-4 pb-5 border border-gray-300 rounded-lg text-black dark:text-white bg-white dark:bg-[#1E1E1E] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
							aria-label="User Address"
							readOnly
						/>
					</div>

					{/* City */}
					<div>
						<label
							htmlFor="userCity"
							className="font-inter font-normal text-base leading-[28px] text-black dark:text-white mb-4"
						>
							City
						</label>
						<input
							id="userCity"
							value={userCity || ""}
							className="w-full pt-2 px-4 pb-5 border border-gray-300 rounded-lg text-black dark:text-white bg-white dark:bg-[#1E1E1E] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
							aria-label="User City"
							readOnly
						/>
					</div>

					{/* Country */}
					<div>
						<label
							htmlFor="userCountry"
							className="font-inter font-normal text-base leading-[28px] text-black dark:text-white mb-4"
						>
							Country
						</label>
						<input
							id="userCountry"
							value={userCountry || ""}
							className="w-full pt-2 px-4 pb-5 border border-gray-300 rounded-lg text-black dark:text-white bg-white dark:bg-[#1E1E1E] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
							aria-label="User Country"
							readOnly
						/>
					</div>

					{/* Phone Number */}
					<div>
						<label
							htmlFor="userPhone"
							className="font-inter font-normal text-base leading-[28px] text-black dark:text-white mb-4"
						>
							Phone
						</label>
						<input
							id="userPhone"
							type="tel"
							value={userPhone || ""}
							className="w-full pt-2 px-4 pb-5 border border-gray-300 rounded-lg text-black dark:text-white bg-white dark:bg-[#1E1E1E] placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
							aria-label="User Phone"
							readOnly
						/>
					</div>
				</form>
			</div>
		</section>
	);
}

export default UserDashboard;
