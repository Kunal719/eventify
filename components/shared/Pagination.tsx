"use client"

import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

type PaginationProps = {
    page: number | string,
    totalPages: number,
    urlParamName?: string
}

const Pagination = ({ urlParamName, page, totalPages }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onClick = (btnType: string) => {

        let newUrl = '';
        if (btnType === 'prev') {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: urlParamName || 'page',
                value: (Number(page) - 1).toString()
            })
        } else {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: urlParamName || 'page',
                value: (Number(page) + 1).toString()
            })
        }
        router.push(newUrl, { scroll: false })
    }

    return (
        <div className='flex gap-2'>
            <Button
                variant='outline'
                className='w-28'
                onClick={() => onClick('prev')}
                size="lg"
                disabled={Number(page) <= 1}
            >
                Previous
            </Button>
            <Button
                variant='outline'
                className='w-28'
                onClick={() => onClick('next')}
                size="lg"
                disabled={Number(page) >= totalPages}
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination