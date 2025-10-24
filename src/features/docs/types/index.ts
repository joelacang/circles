export type ContactInfo = {
  email: string;
  address: string;
  phone?: string;
};

export type Content = {
  title?: string;
  items?: string[];
  contactInfo?: ContactInfo;
};

export type Section = {
  heading: string;
  content: Content | Content[];
};
export type Document = {
  title: string;
  sections: Section[];
};
