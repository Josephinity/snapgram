import PostForm from "@/components/forms/PostForm.tsx";


function CreatePost() {


    return (
        <section className="common-container">
            <div className="w-full max-w-5xl flex-start">
                <img src="/assets/icons/gallery-add.svg"
                     alt="add"
                     className="invert-white pr-2 w-10 h-10" />
                <h2 className="h3-bold md:h2-bold w-full">Create Post</h2>
            </div>
            <div className="w-full max-w-5xl">
                <PostForm />
            </div>
        </section>
    );
}

export default CreatePost;