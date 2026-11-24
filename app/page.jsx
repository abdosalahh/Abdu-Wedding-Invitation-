import WeddingClient from "../components/WeddingClient";

export default function LocalPreviewPage() {
  return (
    <WeddingClient
      slug="local-preview"
      wedding={{
        id: "local-preview",
        groom: "عبدالرحمن",
        bride: "آية",
        groomEn: "Abdulrahman",
        brideEn: "Aya",
        date: "2026-12-18T19:00:00+02:00",
        displayDate: "18 ديسمبر 2026",
        heroImage: "/images/aa.JPG?v=4",
        music: "/music/farha.mp3",
        venue: "قاعة الماسة - الحديقة الدولية بوابة 2 - عباس العقاد مدينة نصر",
        venueEn: "Al-Masa Hall – International Park, Gate 2 – Abbas El-Akkad, Nasr City",
        mapUrl: "https://maps.app.goo.gl/JZJMpwqbXk2ru5Xp9",
      }}
    />
  );
}
