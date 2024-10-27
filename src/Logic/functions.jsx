import { useContext, useState } from "react"

export function filterDataBy(data) {
    // console.log(data[4])
    if (data[4] === 'W') {
        return filterDataByWeek(data)
    }
    if (data[4] === 'M') {
        return filterDataByMonth(data)
    }
    if (data[4] === 'Y') {
        return filterDataByYear(data)
    }
}

function filterDataByWeek(data) {
    const today = new Date()

    // calcula el domingo de la semana actual
    const currentDay = today.getDay()
    const sundayOfCurrentWeek = new Date(today)
    sundayOfCurrentWeek.setDate(today.getDate() - currentDay)

    // calcula el sabado de la semana actual
    const saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek)
    saturdayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() + 6)

    const filteredData = data[0].filter(entry => {
        const entryDate = new Date(entry.date)
        return entryDate >= sundayOfCurrentWeek && entryDate <= saturdayOfCurrentWeek
    })
    const sortedData = Sort(filteredData)
    return sortedData
}

function filterDataByMonth(data) {
    const filteredData = data[0].filter(entry => {
        if (entry.date) {
            const entryDate = new Date(entry.date);
            const entryMonth = entryDate.getMonth()
            const entryYear = entryDate.getFullYear()
            return entryMonth === data[2] && entryYear === data[3]
        }
        return false
    })

    const sortedData = Sort(filteredData)

    return sortedData
}

function filterDataByYear(data) {
    const filteredData = data[0].filter(entry => {
        if (entry.date) {
            const entryDate = new Date(entry.date)
            const entryYear = entryDate.getFullYear()
            return entryYear === data[3]
        }
    })

    const sortedData = Sort(filteredData)

    return sortedData
}


export const TotalSum2 = (filteredDataList) => {
    // filteredDataList.map(i => {
    //     console.log(i.amount)

    // })

    const total = filteredDataList.reduce((sum, entry) => {
        return sum + (typeof entry.amount === 'string' ? parseFloat(entry.amount) : entry.amount)
    }, 0)
    return total.toFixed(2)
}

export function Sort(data) {
    const out = data.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA
    })
    return out
}