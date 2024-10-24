"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import Cookies from "js-cookie";

import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import SignInWithGoogle from "./SignInWithGoogle";
import SignInWithFacebook from "./SignInWithFacebook";
import Button from "../buttons/Button";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [errMsg, setErrMsg] = useState("");
	const router = useRouter();

	const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

	const validatePassword = (password: string) => {
		if (password.length < 6) return "Password must be at least 6 characters";
		if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password))
			return "Password must contain both letters and numbers";
		return "";
	};

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newEmail = e.target.value;
		setEmail(newEmail);
		setErrors((prevErrors) => ({
			...prevErrors,
			email: newEmail
				? validateEmail(newEmail)
					? ""
					: "Invalid email format"
				: "Email is required",
		}));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setPassword(newPassword);
		setErrors((prevErrors) => ({
			...prevErrors,
			password: newPassword
				? validatePassword(newPassword)
				: "Password is required",
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors = {
			email: email
				? validateEmail(email)
					? ""
					: "Invalid email format"
				: "Email is required",
			password: password ? validatePassword(password) : "Password is required",
		};

		setErrors(newErrors);

		if (!newErrors.email && !newErrors.password) {
			try {
				setLoading(true);

				// Authenticate user
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;

				Cookies.set("auth", user.uid); // Set a cookie with user ID

				// Confirm user data is available
				const userDoc = await getDoc(doc(db, "users", user.uid));
				if (!userDoc.exists()) {
					try {
						const storedUserData = localStorage.getItem("registrationData");
						if (storedUserData) {
							const parsedUserData = JSON.parse(storedUserData);
							console.log("Parsed User Data:", parsedUserData);

							// Ensure the stored ID matches the user UID
							if (parsedUserData.id === user.uid) {
								await setDoc(doc(db, "users", user.uid), parsedUserData);

								// Remove the stored registration data after successfully saving it
								localStorage.removeItem("registrationData");
							} else {
								console.error(
									"Stored user ID does not match the authenticated user UID."
								);
							}
						} else {
							console.error("No registration data found in localStorage.");
						}
					} catch (error) {
						console.error("Error saving user data:", error);
					}
				}

				router.push("/");
				toast.success("Logged in successfully!");
			} catch (error: any) {
				let errorMessage;
				switch (error.code) {
					case "auth/user-not-found":
						errorMessage = "No user found with this email.";
						break;
					case "auth/wrong-password":
						errorMessage = "Incorrect password.";
						break;
					case "auth/invalid-email":
						errorMessage = "Invalid email address.";
						break;
					case "auth/invalid-credential":
						errorMessage = "Invalid credentials";
						break;
					// Add more cases as needed
					default:
						errorMessage = "An error occurred. Please try again.";
				}
				console.log("Error", error);
				setErrMsg(errorMessage);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className="flex-1 w-full max-w-full md:max-w-[400px] mt-5 sm:mt-0">
			{/* Heading */}
			<h1 className="heading">Log In</h1>

			{/* Headline */}
			<p className="headline">Enter your credentials to access your account</p>

			{/* Form */}
			<form onSubmit={handleSubmit}>
				<div className="pb-6">
					{/* Email field */}
					<label htmlFor="email" className="label-heading">
						Email Address
					</label>
					<div className="relative">
						<input
							type="email"
							id="email"
							className={`w-full p-4 border ${
								errors.email ? "border-error" : "border-gold-border"
							} rounded-md text-[#101928] dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-sm leading-[20.3px] focus:outline-none focus:ring-2 focus:ring-gold-border`}
							placeholder="Enter your email"
							value={email}
							onChange={handleEmailChange}
						/>
						<span className="absolute inset-y-0 right-0 pr-[18px] flex items-center">
							<Mail className="text-gray-light w-5 h-5" />
						</span>
					</div>
					{errors.email && (
						<p className="mt-2 text-error dark:text-red-500 text-sm">
							{errors.email}
						</p>
					)}
				</div>

				{/* Password field */}
				<div className="mb-2">
					<label htmlFor="password" className="label-heading">
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							className={`w-full p-4 border ${
								errors.password ? "border-error" : "border-gold-border"
							} rounded-md text-[#101928] dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-sm leading-[20.3px] focus:outline-none focus:ring-2 focus:ring-gold-border`}
							placeholder="Enter your password"
							value={password}
							onChange={handlePasswordChange}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 pr-[18px] flex items-center"
							onClick={() => setShowPassword(!showPassword)}
							disabled={loading}
						>
							{showPassword ? (
								<EyeOff className="text-gray-light w-5 h-5" />
							) : (
								<Eye className="text-gray-light w-5 h-5" />
							)}
						</button>
					</div>
					{errors.password && (
						<p className="mt-2 text-error dark:text-red-500 text-sm">
							{errors.password}
						</p>
					)}
				</div>

				{/* forget password */}
				<div className="mb-4 text-right">
					<Link
						href="/auth/forget-password"
						className="text-sm text-gold-text font-libre-franklin font-medium hover:underline "
					>
						Forgot Password?
					</Link>
				</div>

				{errMsg && (
					<p className="text-center text-error dark:text-red-500 text-sm">
						{errMsg}
					</p>
				)}

				<div className="pt-4">
					{/* Submit form */}
					<Button
						type="submit"
						label={loading ? "Logging in..." : "Log into Account"}
					/>
				</div>
			</form>

			{/* <div className="my-6 flex items-center justify-center gap-2">
				<hr className="h-[1px] w-full bg-[#F0F2F5]" />{" "}
				<span className="font-libre-franklin font-normal text-sm text-gray-light text-center inline-block">
					Or
				</span>{" "}
				<hr className="h-[1px] w-full bg-[#F0F2F5]" />
			</div>

			<div className="flex flex-col gap-3 justify-center mb-6">
				<SignInWithGoogle label="Sign in with Google" />
				<SignInWithFacebook label="Sign in with Facebook" />
			</div> */}

			<p className="flex gap-1 justify-center items-center font-libre-franklin font-normal text-sm text-gray-light">
				Are you new here?{" "}
				<Link
					href="/sign-up"
					className="py-1 px-2 font-medium text-gold-text hover:underline"
				>
					Create Account
				</Link>
			</p>

			<div className="flex items-center justify-center my-10 lg:hidden">
				<Image
					src="/logo-black.svg"
					width={60}
					height={60}
					alt="DNBL logo"
					className="dark:invert"
				/>
			</div>
		</div>
	);
}
