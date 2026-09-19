export type User = {
    id: number;
    email : string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    enrollments: Enrollment[];
    purchases: Purchase[];
};

export type Enrollment = {
    id: number;
    userId: number;
    courseId: number;
    enrolledAt: Date;
};

export type Purchase = {
    id: number;
    userId: number;
    courseId: number;
    amount: number;
    status: number;
    paymentId : string;
    purchasedAt: Date;
};

export enum PurchaseStatus {
    PENDING = 0,
    COMPLETED = 1,
    REFUNDED = 2,
    FAILED = 3
}