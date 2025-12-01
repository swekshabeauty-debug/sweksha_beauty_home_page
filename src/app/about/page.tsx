import { getContent, getTeam } from '@/lib/db';
import Image from 'next/image';

export default async function AboutPage() {
    const content = await getContent();
    const team = await getTeam();
    const activeTeam = team.filter((m: any) => m.active);

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="bg-brand-bg py-16 text-center">
                <h1 className="text-4xl font-bold font-serif text-gray-900 mb-4">{content.about.title}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto px-4">
                    Getting to know us is the first step to trusting us with your beauty.
                </p>
            </div>

            <div className="container mx-auto px-4 py-16">
                {/* Story Section */}
                <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                    <div className="md:w-1/2">
                        <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1000&auto=format&fit=crop"
                                alt="About Sweksha Beauty"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                            {content.about.description}
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Core Values</h3>
                        <ul className="space-y-3">
                            {content.about.values.map((val: string, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700">
                                    <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                                    {val}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold font-serif text-center text-gray-900 mb-12">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeTeam.map((member: any) => (
                            <div key={member.id} className="text-center group">
                                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-md border-4 border-brand-bg group-hover:border-brand-secondary transition">
                                    {member.image ? (
                                        <Image src={member.image} alt={member.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Photo</div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                <p className="text-brand-primary font-medium mb-2">{member.role}</p>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
