import {useCallback, useState} from "react";
import {FileWithPath, useDropzone} from "react-dropzone";
import {Button} from "@/components/ui/button.tsx";

type FileUploaderProps = {
    fieldChange: (files: File[])=>void,
    mediaUrl: string
}

function FilesUploader({fieldChange} : FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [fileUrls, setFileUrls] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        fieldChange(acceptedFiles)

        const newFiles = [...acceptedFiles, ...files]
        setFiles(newFiles)

        setFileUrls(newFiles.map(file => URL.createObjectURL(file)))

    }, [files])

    const {getRootProps, getInputProps, open} = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.gif', 'jpg', '.jpeg']
        },
        noClick: true
    })

    return (
        <>
            <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()}  />
                <div className="file_uploader-box gap-1">
                    <img src="/assets/icons/file-upload.svg" alt="upload"/>
                    <h3 className="base-medium text-light-2 mt-4">Drag photo here</h3>
                    <p className="small-regular text-light-4 mb-6">SVG, PNG, JPG</p>
                    <Button className="shad-button_dark_4" onClick={open}>Select from computer</Button>
                </div>
            </div>
            {
                fileUrls &&
                <div className="flex gap-2">
                    {
                        fileUrls.map(url =>
                            <img src={url}
                                 onLoad={() => URL.revokeObjectURL(url)}
                                 width={50}
                                 height={50}
                            />)
                    }
                </div>
            }
        </>
    )
}

export default FilesUploader;