import Image from "next/image";
import Navbar from '../../components/sections/Navbar';
import Footer from '../../components/sections/Footer';

export default function PanduanPage() {
	return (
		<>
			<Navbar />
			<main className="flex flex-col items-center justify-center min-h-screen py-8 px-4 gap-8">
				<div className="w-full max-w-5xl">
					<div className="flex justify-center mt-12">
						<Image
							src="/alur-pengisian.svg"
							alt="Alur Pengisian Survei"
							width={1200}
							height={800}
							className="rounded-3xl my-5 w-full h-auto"
							style={{ objectFit: "contain" }}
							priority
						/>
					</div>
					<div className="flex justify-center mt-12">
						<Image
							src="/tingkatan.png"
							alt="Tingkatan Survei"
							width={1200}
							height={800}
							className="rounded-3xl my-5 w-full h-auto"
							style={{ objectFit: "contain" }}
							priority
						/>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
