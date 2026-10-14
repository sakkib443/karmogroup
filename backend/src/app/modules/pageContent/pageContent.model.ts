import { Schema, model } from 'mongoose';

/**
 * The editable content of one page of the website (Site content). `published` is what
 * the site shows; `draft` holds edits not yet published. Both are { sectionKey: values }
 * and hold ONLY what was changed — anything missing falls back to the design's own
 * content in the frontend (client/src/cms/pages). Publishing keeps the last versions
 * so a bad change can be rolled back.
 */
const actorSchema = new Schema({
    id: { type: String },
    name: { type: String, default: '' },
    role: { type: String, default: '' },
}, { _id: false });

const versionSchema = new Schema({
    at: { type: Date, default: Date.now },
    by: { type: actorSchema },
    content: { type: Schema.Types.Mixed, default: {} },
}, { _id: false, minimize: false });

const pageContentSchema = new Schema({
    page: { type: String, required: true, unique: true, trim: true },
    published: { type: Schema.Types.Mixed, default: {} },
    publishedAt: { type: Date },
    publishedBy: { type: actorSchema },
    draft: { type: Schema.Types.Mixed, default: null },
    draftAt: { type: Date },
    draftBy: { type: actorSchema },
    versions: { type: [versionSchema], default: [] },
}, { timestamps: true, minimize: false });

export const PageContent = model('PageContent', pageContentSchema);
