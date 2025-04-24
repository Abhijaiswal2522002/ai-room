import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


function RoomType({SelectedRoomType}) {
    return (
        <div>
            <label className='text-slate-400'>Select Room Type *</label>
            <Select onValueChange={(value)=>SelectedRoomType(value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="livingroom">Living Room</SelectItem>
                    <SelectItem value="Bedroom">Bed Room</SelectItem>
                    <SelectItem value="Kitchen">Kitchen</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="bathroom">Bath Room</SelectItem>
                    <SelectItem value="Garage">Garage</SelectItem>
                    <SelectItem value="housefront">Front of house</SelectItem>
                </SelectContent>
            </Select>

        </div>
    )
}

export default RoomType