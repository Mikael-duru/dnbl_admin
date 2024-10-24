"use client";

import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";

interface ImageUploadProps {
	value: string[];
	onChange: (value: string[]) => void;
	onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	value,
	onChange,
	onRemove,
}) => {
	const onUpload = (result: any) => {
		const uploadedUrl = result.info.secure_url;
		console.log("Uploaded Image URL:", uploadedUrl);
		onChange(uploadedUrl);
	};

	return (
		<div>
			<div className="mb-4 flex flex-wrap items-center gap-4">
				{value.map((url) => (
					<div key={url} className="relative w-[200px] h-auto">
						<div className="absolute top-0 right-0 z-10">
							<Button
								type="button"
								onClick={() => onRemove(url)}
								size="sm"
								className="bg-red-1 text-white"
							>
								<Trash className="h-4 w-4" />
							</Button>
						</div>
						{/* <CldImage
							width="200"
							height="200"
							crop="fill"
							sizes="50w"
							src={url}
							alt="Uploaded image"
							className="object-cover rounded-lg"
						/> */}
						<div className="mt-5">
							<Image
								src={url}
								alt="collection"
								width={500}
								height={500}
								className="object-cover rounded-lg w-[200px] h-[200px]"
							/>
						</div>
					</div>
				))}
			</div>

			<CldUploadWidget uploadPreset="dnbl_project" onSuccess={onUpload}>
				{({ open }) => {
					return (
						<Button
							type="button"
							onClick={() => open()}
							className="font-inter text-body-medium font-semibold text-white bg-[#3E3E3E] hover:scale-95 duration-300 py-6 px-[30px]"
						>
							<Plus className="h-4 w-4 mr-2" /> Upload Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
