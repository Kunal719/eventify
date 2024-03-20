"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator"
import { eventDefaultValues } from "@/constants"
import Dropdown from "./Dropdown"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "./FileUploader"
import { useState } from "react"
import Image from "next/image"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Checkbox } from "../ui/checkbox"
import { useUploadThing } from '@/lib/uploadthing'
import { handleError } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/events.actions"
import { IEvent } from "@/lib/db/models/Event"


type EventFormProps = {
    userId: string
    type: "Create" | "Update",
    event: IEvent | undefined,
    eventId: string | undefined
}

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const initialValues = event && type === 'Update' ?
        { ...event, startDateTime: new Date(event.startDateTime), endDateTime: new Date(event.endDateTime) } :
        eventDefaultValues;

    const router = useRouter();

    const { startUpload } = useUploadThing('imageUploader')

    // 1. Define your form.
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValues
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof eventFormSchema>) {

        let uploadedImageUrl = values.imageUrl;
        if (files.length > 0) {
            const uploadedImages = await startUpload(files);

            if (!uploadedImages) {
                return;
            }

            uploadedImageUrl = uploadedImages[0].url;
        }

        if (type === 'Create') {
            try {
                const newEvent = await createEvent({
                    event: {
                        ...values,
                        imageUrl: uploadedImageUrl
                    },
                    userId,
                    path: '/profile'
                })

                if (newEvent) {
                    form.reset();
                    router.push(`/events/${newEvent._id}`);
                }
            }
            catch (error) {
                handleError(error);
            }
        }

        if (type === 'Update') {
            if (!eventId) {
                router.back();
                return;
            }

            try {
                const updatedEvent = await updateEvent({
                    userId,
                    event: {
                        ...values,
                        imageUrl: uploadedImageUrl,
                        _id: eventId
                    },
                    path: `/events/${eventId}`
                })

                if (updatedEvent) {
                    form.reset();
                    router.push(`/events/${updatedEvent._id}`);
                }
            }
            catch (error) {
                handleError(error);
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input placeholder="Event Title" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Dropdown onChangeHandler={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-60">
                                    <Textarea placeholder="Description" {...field} className="textarea rounded-2xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl className="h-60">
                                    <FileUploader onFieldChange={field.onChange} value={field.value} setFiles={setFiles} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex items-center h-[54px] w-full overflow:hidden rounded-full bg-grey-50 px-4">
                                        <Image src="/assets/icons/location-grey.svg" alt="location" width={24} height={24} />
                                        <Input placeholder="Event Location or Online" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="startDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex items-center h-[54px] w-full overflow:hidden rounded-full bg-grey-50 px-4">
                                        <Image src="/assets/icons/location-grey.svg" alt="calender" width={24} height={24} />
                                        <p className='text-grey-600 whitespace-nowrap ml-4'>Start Date</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect
                                            timeInputLabel="Time"
                                            dateFormat="dd/MM/yyyy h:mm aa"
                                            wrapperClassName="datePicker" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endDateTime"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex items-center h-[54px] w-full overflow:hidden rounded-full bg-grey-50 px-4">
                                        <Image src="/assets/icons/location-grey.svg" alt="calender" width={24} height={24} />
                                        <p className='text-grey-600 whitespace-nowrap ml-4'>End Date</p>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect
                                            timeInputLabel="Time"
                                            dateFormat="dd/MM/yyyy h:mm aa"
                                            wrapperClassName="datePicker" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex items-center h-[54px] w-full overflow:hidden rounded-full bg-grey-50 px-4">
                                        <Image src="/assets/images/rupee.png" alt="price" width={18} height={18} className="ml-1" />
                                        <Input type="number" placeholder="Price" {...field} className="input-field" />
                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center">
                                                            <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Free Ticket</label>
                                                            <Checkbox id="isFree" onCheckedChange={field.onChange} checked={field.value} className="mr-2 h-5 w-5 border-[1px] border-primary-500" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <div className="flex items-center h-[54px] w-full overflow:hidden rounded-full bg-grey-50 px-4">
                                        <Image src="/assets/icons/link.svg" alt="link" width={24} height={24} />
                                        <Input placeholder="URL" {...field} className="input-field" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="button w-full">
                    {form.formState.isSubmitting ? "Submitting..." : `${type} Event`}
                </Button>
            </form>
        </Form>
    )
}

export default EventForm