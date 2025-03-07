import { Button } from "@/components/ui/button";

export default function ColorsPage() {
  const colorVariants = [
    { name: "Primary", bg: "bg-primary", text: "text-primary-foreground" },
    { name: "Secondary", bg: "bg-secondary", text: "text-secondary-foreground" },
    { name: "Muted", bg: "bg-muted", text: "text-muted-foreground" },
    { name: "Accent", bg: "bg-accent", text: "text-accent-foreground" },
    { name: "Destructive", bg: "bg-destructive", text: "text-white" },
  ];

  const baseColors = [
    { name: "White", bg: "bg-white", text: "text-black" },
    { name: "Black", bg: "bg-black", text: "text-white" },
    { name: "Off White", bg: "bg-[#fbfbfb]", text: "text-black" },
  ];

  const grayScaleColors = [
    { name: "Gray 100", bg: "bg-[#f7f7f7]", text: "text-black" },
    { name: "Gray 200", bg: "bg-[#ebebeb]", text: "text-black" },
    { name: "Gray 300", bg: "bg-[#b4b4b4]", text: "text-white" },
    { name: "Gray 400", bg: "bg-[#8e8e8e]", text: "text-white" },
    { name: "Gray 500", bg: "bg-[#707070]", text: "text-white" },
    { name: "Gray 600", bg: "bg-[#444444]", text: "text-white" },
    { name: "Gray 700", bg: "bg-[#343434]", text: "text-white" },
  ];

  const chartColors = [
    { name: "Teal", bg: "bg-chart-1", text: "text-white" },
    { name: "Blue", bg: "bg-chart-2", text: "text-white" },
    { name: "Navy", bg: "bg-chart-3", text: "text-white" },
    { name: "Gold", bg: "bg-chart-4", text: "text-white" },
    { name: "Orange", bg: "bg-chart-5", text: "text-white" },
  ];

  const ColorSection = ({ title, colors }: { title: string; colors: any[] }) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="space-y-2">
            <div
              className={`${color.bg} ${color.text} p-4 rounded-lg shadow-md flex items-center justify-center h-20 transition-transform hover:scale-105`}
            >
              {color.name}
            </div>
            <div className="text-sm text-muted-foreground text-center">
              {color.bg.replace("bg-", "")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ButtonSection = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Button Variants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Button variant="default">Default Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="link">Link Button</Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Color System</h1>
      
      <ColorSection title="Theme Colors" colors={colorVariants} />
      <ColorSection title="Base Colors" colors={baseColors} />
      <ColorSection title="Gray Scale" colors={grayScaleColors} />
      <ColorSection title="Chart Colors" colors={chartColors} />
      <ButtonSection />
    </div>
  );
}
