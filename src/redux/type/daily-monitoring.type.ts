export enum DailyMonitoringField {
  Header = 'Header',
  Detail = 'Detail',
}

export type DailyMonitoringData = {
  [DailyMonitoringField.Header]: {
    PayorID: string
    CorporateID: string
    PolicyNo: string
    ClaimID: string
    MemberID: string
    MemberName: string
    CardNo: string
    NIK: string
    PD: string
    ClaimType: string
    ClaimStatus: string
    ProviderID: string
    ProviderName: string
    AdmissionDate: string
    DischargeDate: string
    Days: string
    ICDX: string
    ICDXDesc: string
    CoverageID: string
    PlanID: string
    DisabilityNo: string
    AmtInccured: string
    AmtApproved: string
    AmtNotApproved: string
    AmtAsoApproved: string
    Remarks: string
  }
  [DailyMonitoringField.Detail]: {
    'AL, TC, GL, CL,Persetujuan tindakan, DL': string
    'Anamnesa Dyspepsia, gastritis?psikosomatis ? Trauma-> penyebab,punya sim ?': string
    'Diagnosa (perketidakmampuan, pengecualian)': string
    'Dr. Yang merawat': string
    'Indemnity Form': string
    'Indikasi Rawat Inap (Bila tidak kuat investigasi ke dr.)': string
    'K/U T,N,R,S Cor / Pumo, Abdomen, Tumor/kelainan kulit : regio, ukuran ?': string
    'Kelas Perawatan / RP (Naik APS/penuh/toleransi SK)': string
    'Notes / Keterangan': string
    'Operasi Jenis, katergori ODC/NU (indikasi ?)': string
    'Pemeriksaan Penunjang BIAYA ? Lab : hb, ht, L, tr, Widal, UL, FL Radiologi, EKG, EEG, USG, CT Scan, MRI, appendicogram': string
    'Perkiraan Biaya': string
    'Petugas RS (Admin / R. Perawatan)': string
    'Rencana Th/ atau Tindakan': string
    days: number
    tanggal: string
  }[]
}

export type DailyMonitoringPayload = {
  payor_code: string
  start_date: string
  end_date: string
}
