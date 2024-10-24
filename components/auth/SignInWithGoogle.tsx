import { auth, db } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import Cookies from "js-cookie";

interface SignInWithGoogleProps {
	label: string;
}

const SignInWithGoogle: React.FC<SignInWithGoogleProps> = ({ label }) => {
	const router = useRouter();

	const googleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			Cookies.set("auth", user.uid); // Set a cookie with user ID

			console.log("User Google Info:", user);
			if (user) {
				// console.log(user); // Log the user object for debugging
				// Extract first name and last name from displayName
				const [firstName, lastName] = user.displayName
					? user.displayName.split(" ")
					: ["", ""];

				// Check if user document already exists in Firestore
				const userDocRef = doc(db, "users", user.uid);
				const userDocSnapshot = await getDoc(userDocRef);

				if (!userDocSnapshot.exists()) {
					// Save user data to Firestore
					await setDoc(userDocRef, {
						firstName: firstName,
						lastName: lastName,
						email: user.email,
						id: user.uid,
						photoURL: user.photoURL,
						address: "",
						city: "",
						country: "",
						phoneNumber: "",
						displayName: user.displayName || "",
						isEmailVerified: true,
						createdAt: new Date(),
					});
				}

				// Temporary store user data in local storage
				localStorage.setItem(
					"GoogleData",
					JSON.stringify({
						firstName: firstName,
						lastName: lastName,
						email: user.email,
						id: user.uid,
						photoURL: user.photoURL,
						address: "",
						city: "",
						country: "",
						phoneNumber: "",
						displayName: user.displayName || "",
						isEmailVerified: true,
						createdAt: new Date(),
					})
				);

				router.push("/");
				toast.success(`Welcome ${user.displayName}!`);
			}
		} catch (error) {
			console.error("Error signing in with Google:", error);
			toast.error("Failed to log in. Please try again.");
		}
	};

	return (
		<button
			className="flex justify-center items-center gap-4 p-4 border-[1.5px] border-gray-border rounded-[6px] text-[#344054] dark:text-gray-300 hover:text-white hover:bg-btn-gold"
			onClick={googleLogin}
		>
			<FcGoogle className="shrink-0 text-xl" />
			<span className="inline-block font-libre-franklin text-base font-semibold transition duration-200 ease-in-out transform">
				{label}
			</span>
		</button>
	);
};

export default SignInWithGoogle;
