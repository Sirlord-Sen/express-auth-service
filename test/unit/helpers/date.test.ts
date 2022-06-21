import { DateHelper } from "@helpers/"

describe("Date Helper", ()=> {
    it("isSameDay return true for two same dates of different formats", ()=>{
        const date = new Date()
        const newDate = Number(date)
        const isSameDay = DateHelper.isSameDay(date, newDate)

        expect(isSameDay).toBe(true)
    })

    it("isSameDay returns false for different days", async()=>{
        const date = new Date()
        const newDate = Number(date) + (25 * 60 * 60 * 1000)
        const isSameDay = DateHelper.isSameDay(date, newDate)

        expect(isSameDay).toBe(false)
    })

    it("addMillisecondToDate returns false for different days", async()=>{
        const date = new Date()
        const ms = 25 * 60 * 60 * 1000
        const manualAdded = new Date((Number(date) + ms))
        const addedDate = DateHelper.addMillisecondToDate(date, ms)

        expect(addedDate).toEqual(manualAdded)
    })

    it("format returns formatted string for 'yyyy-MM-dd'", async()=>{
        const date = new Date()
        const addedDate = DateHelper.format(date)
        
        expect(addedDate).toMatch(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
    })

    it("format returns formatted string for 'MM-dd-yy'", async()=>{
        const date = new Date()
        const addedDate = DateHelper.format(date, 'MM-dd-yy')
        
        expect(addedDate).toMatch(/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/)
    })

    it("convertToMS returns converted 5hours string to milliseconds", async()=>{
        const time = 5 * 60 * 60 * 1000
        const ms = DateHelper.convertToMS('5h')
        
        expect(ms).toEqual(time)
    })

    it("convertToMS returns converted 7 days string to milliseconds", async()=>{
        const time = 7 * 24 * 60 * 60 * 1000
        const ms = DateHelper.convertToMS('7d')
        
        expect(ms).toEqual(time)
    })

    it("convertToMS returns converted 5months string to milliseconds", async()=>{
        const time = 5 * 30 * 24 * 60 * 60 * 1000
        // Taking a month as 30 days
        const ms = DateHelper.convertToMS(`${5 * 30}d`)
        
        expect(ms).toEqual(time)
    })

    // Not tested Unix Time

})
