// Dummy password data for frontend display

export interface DummyPasswordEntry {
  id: string;
  title: string;
  website: string;
  username: string;
  category: string;
  lastUpdated: string; // Simple string for now
}

export const dummyPasswords: DummyPasswordEntry[] = [
  {
    id: "1",
    title: "Google Account",
    website: "google.com",
    username: "test.user@gmail.com",
    category: "Work",
    lastUpdated: "2024-04-14",
  },
  {
    id: "2",
    title: "GitHub",
    website: "github.com",
    username: "TestUser",
    category: "Development",
    lastUpdated: "2024-04-10",
  },
  {
    id: "3",
    title: "AWS Console",
    website: "aws.amazon.com",
    username: "aws-admin",
    category: "Work",
    lastUpdated: "2024-03-20",
  },
  {
    id: "4",
    title: "Netflix",
    website: "netflix.com",
    username: "my_email@domain.com",
    category: "Personal",
    lastUpdated: "2024-01-05",
  },
  {
    id: "5",
    title: "Local Dev DB",
    website: "localhost:5432",
    username: "dev_user",
    category: "Development",
    lastUpdated: "2023-11-11",
  },
];
