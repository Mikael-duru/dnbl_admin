"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import Modal from "@/components/Modal";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import Loader from "@/components/Loader";

function NewPassword() {
	const [isLoading, setIsLoading] = useState(true);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
	const [errMsg, setErrMsg] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
	const router = useRouter();
	const searchParams = useSearchParams();

	// const mode = searchParams.get("mode");
	const code = searchParams.get("oobCode");

	useEffect(() => {
		setIsLoading(false);
	}, []);

	// Validate Password
	const validatePassword = (password: string) => {
		if (password.length < 6) return "Password must be at least 6 characters";
		if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(password))
			return "Password must contain both letters and numbers";
		return "";
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

	const handleConfirmPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const newConfirmPassword = e.target.value;
		setConfirmPassword(newConfirmPassword);
		setErrors((prevErrors) => ({
			...prevErrors,
			confirmPassword:
				newConfirmPassword !== password
					? "Passwords do not match"
					: validatePassword(newConfirmPassword),
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors = {
			password: password ? validatePassword(password) : "Password is required",
			confirmPassword:
				confirmPassword !== password
					? "Passwords do not match"
					: validatePassword(confirmPassword),
		};

		setErrors(newErrors);

		if (!newErrors.password && !newErrors.confirmPassword) {
			if (!code) {
				setErrMsg("Invalid password reset link.");
				return;
			}
			try {
				await confirmPasswordReset(auth, code, password);
				setIsModalOpen(true);
			} catch (error) {
				const errorMessage = handleFirebaseError(error);
				console.log("Reset Error", error);
				setErrMsg(errorMessage);
			}
		}
	};

	const handleFirebaseError = (error: unknown): string => {
		if (error instanceof Error && "code" in error) {
			switch (error.code) {
				case "auth/invalid-action-code":
					return "This link is invalid or has expired.";
				case "auth/expired-action-code":
					return "This link has expired. Please request a new password reset.";
				case "auth/weak-password":
					return "Password should be at least 6 characters.";
				case "auth/missing-password":
					return "Please enter a password.";
				default:
					return "An error occurred. Please try again.";
			}
		}
		return "An unknown error occurred.";
	};

	const handleModalClose = () => {
		setIsModalOpen(false);
		// Redirect to sign-in page
		router.push("/sign-in");
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<section className="flex min-h-screen items-center justify-center bg-white max-2xl:dark:bg-[#2E2E2E]">
			<div className="flex flex-col lg:flex-row gap-5 lg:gap-10 xl:gap-[133px] w-full justify-center items-center xl:justify-start bg-white dark:bg-[#2E2E2E] px-[5%] sm:p-5 overflow-hidden">
				{/* Image Container */}
				<div className="relative rounded-3xl max-h-screen overflow-hidden max-w-full md:max-w-[50%] lg:max-w-[50%] max-lg:mt-5">
					<Image
						src="/assets/signIn-banner.png"
						alt="DNBL Fashion"
						width={700}
						height={984}
						className="max-w-full h-[65vh] sm:h-[80vh] object-cover lg:h-auto" // Set height for mobile and auto for larger screens
					/>
					<div className="absolute inset-0 bg-sign-in-layer"></div>
					<Image
						src="/assets/white-logo.png"
						alt="DNBL Fashion"
						width={196}
						height={88}
						className="max-xl:w-[26%] absolute top-7 left-4 md:left-[28px] z-10"
					/>
				</div>

				<div className="flex-1 w-full max-w-full md:max-w-[400px] px-4 md:px-0">
					<h1 className="heading">Create new Password</h1>
					<p className="headline">
						Create a new password that you can easily recall.
					</p>

					<form onSubmit={handleSubmit}>
						<div className="mb-6">
							<label
								htmlFor="password"
								className="block text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-white mb-1"
							>
								New Password
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

						<div className="mb-6">
							<label
								htmlFor="confirm-password"
								className="block text-sm md:text-base lg:text-lg font-medium text-gray-700 dark:text-white mb-1"
							>
								Confirm Password
							</label>
							<div className="relative">
								<input
									type={showConfirmPassword ? "text" : "password"}
									id="confirm-password"
									className={`w-full p-4 border ${
										errors.confirmPassword
											? "border-error"
											: "border-gold-border"
									} rounded-md text-[#101928] dark:text-white placeholder:text-[#98A2B3] dark:placeholder:text-gray-400 text-sm leading-[20.3px] focus:outline-none focus:ring-2 focus:ring-gold-border`}
									placeholder="Confirm your password"
									value={confirmPassword}
									onChange={handleConfirmPasswordChange}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-[18px] flex items-center"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className="text-gray-light w-5 h-5" />
									) : (
										<Eye className="text-gray-light w-5 h-5" />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<p className="mt-2 text-error dark:text-red-500 text-sm">
									{errors.confirmPassword}
								</p>
							)}
						</div>

						{errMsg && (
							<p className="text-error dark:text-red-500 text-sm text-center">
								{errMsg}
							</p>
						)}

						<div className="mt-4">
							<ButtonPrimary type="button" label="Change Password" />
						</div>

						<div className="flex items-center justify-center mt-10 lg:hidden">
							<Image
								src="/assets/logo-black.svg"
								width={60}
								height={60}
								alt="DNBL logo"
							/>
						</div>
					</form>

					<Modal
						isOpen={isModalOpen}
						onClose={handleModalClose}
						src="/assets/success-lock.svg"
						heading="Password reset successful"
						paragraphText="Sign in with your new password, keep it secure, and enjoy exploring!"
						buttonLabel="Continue to sign in"
					/>
				</div>
			</div>
		</section>
	);
}

export default NewPassword;
