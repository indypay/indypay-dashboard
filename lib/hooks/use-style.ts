import { createStyles } from 'antd-style';

// All colours reference CSS custom properties injected by TenantContext.
// Switching tenant updates :root vars → every table, input, and pagination
// across the entire dashboard re-colours instantly without a page reload.

export const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      /* ── Inputs ──────────────────────────────────────────────────────── */
      .custom-search-input .ant-input,
      .custom-input {
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
        caret-color: var(--text) !important;
        box-shadow: none !important;

        &::placeholder {
          color: var(--text-muted) !important;
        }

        &:hover {
          background-color: var(--surface) !important;
          border-color: var(--primary) !important;
          color: var(--text) !important;
          box-shadow: none !important;
        }

        &:focus,
        &:focus-within {
          background-color: var(--surface) !important;
          border-color: var(--primary) !important;
          color: var(--text) !important;
          box-shadow: none !important;
          outline: none !important;
        }
      }

      .custom-search-input .ant-input-affix-wrapper {
        background-color: var(--surface) !important;
        border-color: var(--border) !important;
        box-shadow: none !important;

        &:hover,
        &:focus,
        &:focus-within {
          background-color: var(--surface) !important;
          border-color: var(--primary) !important;
          box-shadow: none !important;
          outline: none !important;
        }
      }

      .custom-search-input .ant-input-search-button {
        background-color: var(--background) !important;
        border-color: var(--border) !important;
        color: var(--text-muted) !important;
        box-shadow: none !important;

        &:hover {
          border-color: var(--primary) !important;
          color: var(--primary) !important;
          box-shadow: none !important;
        }
      }

      /* ── Selects ─────────────────────────────────────────────────────── */
      .custom-select .ant-select-selector {
        background-color: var(--surface) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        box-shadow: none !important;

        .ant-select-selection-placeholder {
          color: var(--text-muted) !important;
        }

        .ant-select-selection-item {
          color: var(--text) !important;
        }
      }

      .custom-select:hover .ant-select-selector {
        background-color: var(--surface) !important;
        border-color: var(--primary) !important;
        box-shadow: none !important;
      }

      .custom-select.ant-select-focused .ant-select-selector,
      .custom-select.ant-select-open .ant-select-selector {
        background-color: var(--surface) !important;
        border-color: var(--primary) !important;
        box-shadow: none !important;
        outline: none !important;
      }

      /* ── Table wrapper border ─────────────────────────────────────────── */
      .ant-table-wrapper {
        width: 100%;
        background: linear-gradient(to right, var(--border), var(--primary));
        border-radius: 12px;
        padding: 2px;
      }

      .ant-table-inner-wrapper {
        background: var(--surface);
        border-radius: 10px;
        padding: 14px;
      }

      /* ── Table ────────────────────────────────────────────────────────── */
      .ant-table {
        background: var(--surface);
        border-radius: 8px;

        .ant-table-container {
          border-radius: 8px;

          .ant-table-body,
          .ant-table-content {
            scrollbar-width: thin;
            scrollbar-color: var(--primary) var(--background);
          }

          &::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }

          &::-webkit-scrollbar-track {
            background: var(--background);
            border-radius: 4px;
          }

          &::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 4px;

            &:hover {
              background: var(--secondary);
            }
          }
        }

        .ant-table-thead > tr > th {
          background: var(--background) !important;
          color: var(--text-muted) !important;
          border-bottom: 1px solid var(--border) !important;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 16px 12px;
        }

        .ant-table-tbody > tr {
          background: var(--surface);
          transition: background 0.2s;

          &:hover > td {
            background: var(--background) !important;
          }

          > td {
            border-bottom: 1px solid var(--border) !important;
            color: var(--text) !important;
            padding: 16px 12px;
          }
        }
      }

      .ant-table-cell-fix-left,
      .ant-table-cell-fix-right {
        background: var(--surface) !important;
      }

      .ant-table-thead .ant-table-cell-fix-left,
      .ant-table-thead .ant-table-cell-fix-right {
        background: var(--background) !important;
      }

      .ant-table-tbody > tr:hover {
        .ant-table-cell-fix-left,
        .ant-table-cell-fix-right {
          background: var(--background) !important;
        }
      }

      .ant-table-bordered .ant-table-container {
        border: none;
        border-radius: 8px;
      }

      /* ── DatePicker ───────────────────────────────────────────────────── */
      .custom-date-picker {
        .ant-picker-input > input {
          color: var(--text) !important;
        }

        .ant-picker-suffix,
        .ant-picker-separator {
          color: var(--text-muted) !important;
        }
      }

      /* ── Pagination ───────────────────────────────────────────────────── */
      .custom-pagination {
        .ant-pagination-item,
        .ant-pagination-item-link,
        .ant-pagination-total-text,
        .ant-pagination-jump-prev,
        .ant-pagination-jump-next,
        .ant-pagination-options-quick-jumper input {
          color: var(--text) !important;
        }

        .ant-pagination-item-active {
          background: linear-gradient(to right, var(--secondary), var(--primary)) !important;
          border-color: transparent !important;

          a {
            color: #ffffff !important;
          }
        }

        .ant-pagination-item {
          background: var(--surface) !important;
          border-color: var(--border) !important;

          a {
            color: var(--text) !important;
          }

          &:hover {
            border-color: var(--primary) !important;
          }
        }

        .ant-pagination-prev,
        .ant-pagination-next {
          .ant-pagination-item-link {
            background: var(--surface) !important;
            border-color: var(--border) !important;
            color: var(--text) !important;

            &:hover {
              border-color: var(--primary) !important;
            }
          }
        }
      }
    `,
  };
});
