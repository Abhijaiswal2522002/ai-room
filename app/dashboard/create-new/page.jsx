"use client";

import React, { use, useContext, useState } from "react";
import ImageSelection from "./_components/ImageSelection";
import RoomType from "./_components/RoomType";
import DesignType from "./_components/DesignType";
import AdditionalReq from "./_components/AdditionalReq";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

import { uploadFile, getFilePreview } from "@/config/appwriteConfig"; // ✅ Make sure path is correct
import CustomLoading from "../_components/CustomLoading";
import AiOutputDialog from "./_components/AiOutputDialog";
import { UserDetailContext } from "@/app/_context/UserDetailContext";

function CreateNew() {
  const[loading,setLoading]=useState(false);
  const[aiOutputImage,setAiOutputImage]=useState();
  const [openOutputDialog,setOpenOutputDialog]=useState(false);
  const[orgImage,setOrgImage]=useState();
    const {user}=useUser();
  const [formData, setFormData] = useState({});
const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const onHandleInputChange = (value, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    console.log({ ...formData, [fieldName]: value });
  };

  // ✅ Uploading image to Appwrite
  const SaveRawImageToAppwrite = async () => {
    try {
      const uploaded = await uploadFile(formData.image);
      console.log("File uploaded:", uploaded);

      const previewUrl = getFilePreview(uploaded.$id); // Get file preview (URL)
      console.log("Preview URL:", previewUrl);
      setOrgImage(previewUrl);
      return previewUrl;
    } catch (error) {
      console.error("Error uploading to Appwrite:", error);
      return null;
    }
  };

  const GenerateAiImage = async () => {
    setLoading(true);
    const rawImageUrl = await SaveRawImageToAppwrite();
    if (!rawImageUrl) return;

    const result = await axios.post("/api/redesign-room", {
      imageUrl:rawImageUrl,
      roomType:formData?.roomType,
      designType:formData?.designType,
      additionalReq:formData?.additionalReq,
      userEmail:user?.primaryEmailAddress?.emailAddress
    });
    console.log("AI redesign response:", result);
    await updateUserCredits();
    setAiOutputImage(result.data.result);
    setOpenOutputDialog(true);
setLoading(false);
   
  };
  const updateUserCredits=async()=>{
    const result=await db.update(Users).set({
      credits:userDetail?.credits-1
    }).returning({id:Users.id});
    if(result){
      setUserDetail(prev=>({
        ...prev,
        credits:userDetail?.credits-1}))
        return result[0].id
      
    }
  }

  return (
    <div>
      <h2 className="font-bold text-4xl text-purple-500 text-center">
        Experience the magic of AI to bring reality to your dreams
      </h2>
      <p className="text-center text-gray-500">
        Transform any area with a simple click. Select a space, choose a style
        and observe how AI instantly reimagines your environment.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10">
        <ImageSelection selectedImage={(value) => onHandleInputChange(value, "image")} />
        <div>
          <RoomType SelectedRoomType={(value) => onHandleInputChange(value, "roomType")} />
          <DesignType selectedDesignType={(value) => onHandleInputChange(value, "designType")} />
          <AdditionalReq additionalRequirementInput={(value) => onHandleInputChange(value, "additionalReq")} />
          <Button
  className="w-full mt-5 bg-purple-500"
  onClick={GenerateAiImage}
  disabled={loading}
>
  {loading ? "Generating..." : "Generate"}
</Button>

          <p className="text-sm text-gray-400 mb-50">
            Note: 1 Credit will be charged to generate an image
          </p>
        </div>
      </div>
      <CustomLoading loading={loading} />
      <AiOutputDialog openDialog={openOutputDialog}
      closeDialog={()=>setOpenOutputDialog(false)}
orgImage={orgImage}
aiImage={aiOutputImage}
/>      
    </div>
  );
}

export default CreateNew;
