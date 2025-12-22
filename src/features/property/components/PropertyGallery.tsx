interface Props {
    media: { id: number; url: string }[]
}

export default function PropertyGallery({ media }: Props) {
    if (!media.length) return null

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden">
            {media.map((m, index) => (
                <img
                    key={m.id}
                    src={m.url}
                    alt={`Property image ${index + 1}`}
                    className={`w-full h-72 object-cover ${index === 0 ? "md:col-span-2 md:row-span-2 h-full" : ""}`}
                />
            ))}
        </section>
    )
}
