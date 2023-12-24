import {useCallback, useState} from "react";
import {FileWithPath, useDropzone} from "react-dropzone";
import {Button} from "@/components/ui/button.tsx";

type ProfileUploaderProps = {
    fieldChange: (file: File)=>void,
    imageUrl: string
}
function ProfileUploader({fieldChange, imageUrl}: ProfileUploaderProps) {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(imageUrl);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        fieldChange(acceptedFiles[0])

        setFile([acceptedFiles[0]])

        setFileUrl(URL.createObjectURL(acceptedFiles[0]))

    }, [file])

    const {getRootProps, getInputProps, open} = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.gif', 'jpg', '.jpeg']
        },
        noDrag: true
    })

    return (
        <div>
            <div {...getRootProps()} className="cursor-pointer flex items-center">
                <input {...getInputProps()}  />
                {
                    fileUrl &&
                    <img src={fileUrl}
                         onLoad={() => URL.revokeObjectURL(fileUrl)}
                         width={120}
                         height={120}
                         className="rounded-full"
                    />
                }
                <Button className="shad-button_ghost text-primary-500"
                        type="button"
                        onClick={open}
                >Change profile photo</Button>
            </div>

        </div>
    );
}

export default ProfileUploader;