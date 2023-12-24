import {useCallback, useState} from "react";
import {FileWithPath, useDropzone} from "react-dropzone";
import {Button} from "@/components/ui/button";
import {convertFileToUrl} from "@/lib/utils.ts";

type FileUploaderProps = {
    fieldChange: (files: File[])=>void,
    imageUrl: string
}

function FileUploader({fieldChange, imageUrl} : FileUploaderProps) {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(imageUrl);

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        fieldChange(acceptedFiles)
        setFile(acceptedFiles)
        setFileUrl(convertFileToUrl(acceptedFiles[0]))
    }, [file])

    //, open
    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        // noClick: true
    })

    return (

        <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()}  />
            {
                fileUrl
                    ? <div className="file_uploader-box">
                            <img src={fileUrl}
                                 onLoad={() => {
                                        URL.revokeObjectURL(fileUrl)
                                    } // releases the url
                                 }
                                 alt="image"
                                 className="file_uploader-img"
                            />
                            <p className="file_uploader-label">Click or drag to replace</p>
                    </div>
                    : <div className="file_uploader-box gap-1">
                        <img src="/assets/icons/file-upload.svg" alt="upload"/>
                        <h3 className="base-medium text-light-2 mt-4">Drag photo here</h3>
                        <p className="small-regular text-light-4 mb-6">SVG, PNG, JPG</p>
                        <Button type="button"
                                className="shad-button_dark_4"
                                // onClick={open}
                        >Select from computer</Button>
                    </div>
            }
        </div>

    )
}

export default FileUploader;