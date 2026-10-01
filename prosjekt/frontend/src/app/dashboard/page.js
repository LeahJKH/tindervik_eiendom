import StatHeader from '@/app/components/DiftsComponents/Statistics/StatHeader/StatHeader.js'
import StatModal from '@/app/components/DiftsComponents/Statistics/StatModal/StatModal.js'
import CaseListMain from '@/app/components/DiftsComponents/CaseList/CaseListMain/CaseListMain.js'
import CaseListModal from '@/app/components/DiftsComponents/CaseList/CaseListModal/CaseListModal.js'
export default function DashBoard() {
    return (
        <>
        <StatHeader></StatHeader>
        <CaseListMain></CaseListMain>
        </>
    )
}