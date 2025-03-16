import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete existing records (optional)
  await prisma.project.deleteMany();

  const defaultProjects = [
    {
      title: "Luxury Apartments",
      description: "Premium luxury apartments in the heart of the city",
      location: "Downtown Area",
      price: "₹1.2 Cr - ₹2.5 Cr",
      propertyType: "Apartment",
      status: "Active",
      amenities: JSON.stringify([
        "Luxury Lifestyle",
        "Prime Location",
        "Gated Society",
        "Ample Parking",
      ]),
      isReraRegistered: true,
      reraNumbers: JSON.stringify(["RERA123456", "RERA789012"]),
      landmark: "Mall",
      landmarkDistance: "500m",
      latitude: "18.5204",
      longitude: "73.8567",
      images: JSON.stringify([]),
      otherUrls: JSON.stringify([]),
    },
    {
      title: "Green Valley Villas",
      description: "Spacious villas with modern amenities",
      location: "Suburban Area",
      price: "₹80 Lac - ₹1.5 Cr",
      propertyType: "Villa",
      status: "Active",
      amenities: JSON.stringify([
        "Peaceful vicinity",
        "Well Ventilated",
        "Spacious",
        "Family",
      ]),
      isReraRegistered: true,
      reraNumbers: JSON.stringify(["RERA345678"]),
      landmark: "Park",
      landmarkDistance: "200m",
      latitude: "18.5314",
      longitude: "73.8446",
      images: JSON.stringify([]),
      otherUrls: JSON.stringify([]),
    },
    {
      title: "City Center Plaza",
      description: "Commercial spaces for business growth",
      location: "Business District",
      price: "₹2.5 Cr - ₹4 Cr",
      propertyType: "Commercial",
      status: "Inactive",
      amenities: JSON.stringify([
        "Near City Center",
        "Investment Opportunity",
        "Prime Location",
      ]),
      isReraRegistered: true,
      reraNumbers: JSON.stringify(["RERA901234"]),
      landmark: "Metro Station",
      landmarkDistance: "100m",
      latitude: "18.5642",
      longitude: "73.9087",
      images: JSON.stringify([]),
      otherUrls: JSON.stringify([]),
    },
  ];

  for (const project of defaultProjects) {
    await prisma.project.create({
      data: project,
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
