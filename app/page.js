import 'flowbite';
import Navbar from "./components/Navbar";
import TextArea from './components/TextArea';


export default function Home() {
  return (
    <>
    <Navbar />
    <div className="text-center my-10">
      <p className="text-5xl md:text-6xl font-bold mb-4">
        Welcome to <span className="text-red-600">Essay</span>
        <span className="text-green-600">Grader</span>
      </p>
      <p className="text-sm md:text-lg mb-6 mx-1">
      &quot;Whether you are a student or teacher, EssayGrader helps craft well-structured essays with personalized feedback and actionable insights&quot;
      </p>
      <TextArea />
    </div>
    </>
  );
}
